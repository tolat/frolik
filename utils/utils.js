const User = require("../models/user");
const Chat = require("../models/chat");
const nodemailer = require("nodemailer");
const io = require("../server");
const webpush = require("web-push");

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} = require("unique-names-generator");

// Populates an array with stripped down version of friends
// Uses Promise.all for parallel DB queries instead of sequential loop (N+1 fix)
module.exports.populateFriends = async (friends) => {
  return Promise.all(
    friends.map(async (friend) => {
      const friendUser = await User.findById(friend._id || friend);
      await friendUser.populate({
        path: "outings",
        populate: { path: "activity" },
      });

      const strippedOutings = friendUser.outings.map((outing) => ({
        activity: outing.activity,
        completions: outing.completions,
        users: outing.users,
        photos: outing.photos,
        flakes: outing.flakes,
      }));

      return {
        _id: friendUser._id,
        first_name: friendUser.first_name,
        last_name: friendUser.last_name,
        outings: strippedOutings,
        status: friendUser.status,
        location: friendUser.location,
        tagline: friendUser.tagline,
        profile_picture: friendUser.profile_picture,
      };
    })
  );
};

// Generic user population
module.exports.populateUser = async (user) => {
  await user.populate({
    path: "outings",
    populate: [
      { path: "activity" },
      {
        path: "users",
        populate: { path: "outings", populate: { path: "activity" } },
      },
      {
        path: "invited",
        populate: { path: "outings", populate: { path: "activity" } },
      },
    ],
  });

  await user.populate({
    path: "chats",
    populate: { path: "outing" },
  });
};

// Reuse a single transporter instance rather than recreating it on every send
let _transporter = null;
const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDMAIL_FROM,
        pass: process.env.SENDMAIL_FROM_PASSWORD,
      },
    });
  }
  return _transporter;
};

// Send emails to users
module.exports.sendEmail = async (to, subject, html) => {
  try {
    const info = await getTransporter().sendMail({
      from: process.env.SENDMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    // If the credentials were rejected, clear the cached transporter so the
    // next send attempt picks up any updated .env values without a restart.
    if (error.code === "EAUTH") {
      _transporter = null;
    }
  }
};

module.exports.getPhotosFromOutings = (user) => {
  return user.outings.flatMap((outing) => outing.photos.map((p) => p.key));
};

module.exports.generateUniqueName = () => {
  // Generate random unique name
  let uniqueName = [
    ...uniqueNamesGenerator({
      dictionaries: [colors, animals],
    }),
  ];
  uniqueName[0] = uniqueName[0].toUpperCase();
  for (let i = 0; i < uniqueName.length; i++) {
    if (uniqueName[i] == "_") {
      uniqueName[i] = " ";
      uniqueName[i + 1] = uniqueName[i + 1].toUpperCase();
    }
  }
  uniqueName = uniqueName.toString().replaceAll(",", "");
  return uniqueName;
};

// Send an invite update to the creator of the outing in the old Notification
// Update the invited and users list for the outing
// Update the invited user outings list and chat
module.exports.handleOutingInviteAction = async (
  notification,
  user,
  outing,
  status
) => {
  // Remove the notificaiton
  user.notifications.splice(
    user.notifications
      .map((n) => n.id.toString())
      .indexOf(notification.id.toString()),
    1
  );

  // Remove user from outing invited list
  outing.invited.splice(
    outing.invited.map((u) => u.toString()).indexOf(user._id.toString()),
    1
  );

  // If status is accepted, add user to Outing users list and
  // add outing to invited user's outing list
  if (status == "accepted") {
    outing.users.push(user);
    user.chats.push(outing.chat);
    user.outings.push(outing);
  }

  // Get outing creator from the db
  let outingCreator = await User.findById(outing.created_by);

  if (status == "accepted") {
    // Make a new notification to notify other members the outing was joined
    const newOutingJoinedNotification = {
      id: Date.now() + Math.random(),
      type: "outing-join",
      status,
      userID: user._id.toString(),
      outing: outing._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };

    // Initialize user in chat last_read
    await outing.populate("chat");
    outing.chat.last_read[user._id] = false;

    // Notify outing members of outing join
    for (usr of outing.users) {
      const foundUsr = await User.findById(usr);
      // Don't send join notification to the joining 
      if (foundUsr._id.toString() == user._id.toString()) {
        continue;
      }
      foundUsr.notifications.push(newOutingJoinedNotification);
      await foundUsr.save();

      // Send websocket push update to outing users
      this.pushUserUpdate(outing.users);

      // Send webpush Notification
      this.webpushNotify([foundUsr], {
        title: "Outing Joined",
        body: `${user.first_name} ${user.last_name} has joined the Outing: ${outing.name}`,
      });
    }
  } else {
    const createdByUser = await User.findById(outing.created_by);

    // Send websocket push update to outing users
    this.pushUserUpdate(outing.users);

    // Send webpush Notification
    this.webpushNotify([createdByUser], {
      title: "Outing Invite Denied",
      body: `${user.first_name} ${user.last_name} denied your invite for the Outing: ${outing.name}`,
    });
  }

  await outing.save();
  await user.save();
  await outingCreator.save();
  await outing.populate("users");
  await outing.populate("invited");
  await this.populateUser(user);

  // Push updates to the socket
  this.pushUserUpdate([
    user,
    outingCreator,
    ...outing.users,
    ...outing.invited,
  ]);
};

module.exports.pushUserUpdate = (users) => {
  for (const user of users) {
    const usrID = user._id ? user._id.toString() : user.toString();
    io.to(usrID).emit("update-user");
  }
};

module.exports.webpushNotify = async (users, payload) => {
  // Fetch all users from DB in parallel, then send notifications concurrently
  await Promise.all(
    users.map(async (user) => {
      const userID = user._id ? user._id.toString() : user.toString();
      const freshUser = await User.findById(userID).populate({
        path: "chats",
        populate: { path: "outing" },
      });

      if (!freshUser?.pushSubscription) return;

      const userPayload = {
        ...payload,
        notificationCount:
          this.getTotalUnreadMessages(freshUser) +
          (freshUser.notifications?.length ?? 0),
      };

      webpush
        .sendNotification(freshUser.pushSubscription, JSON.stringify(userPayload))
        .catch(async (error) => {
          // 410 Gone / 404 Not Found = subscription is expired or user unsubscribed.
          // Remove it from the DB so we don't keep hitting a dead endpoint.
          if (error.statusCode === 410 || error.statusCode === 404) {
            freshUser.pushSubscription = undefined;
            await freshUser.save();
          } else {
            console.error("Error sending push notification:", error.message);
          }
        });
    })
  );
};

module.exports.handleFriendRequestAction = async (
  notification,
  user,
  requestingUser,
  status
) => {
  // Remove user from friendRequests
  requestingUser.friend_requests = requestingUser.friend_requests.filter(
    (id) => id.toString() != user._id.toString()
  );

  // Make sure we have the requested user
  const requestedUser = await User.findById(
    user._id ? user._id.toString() : user.toString()
  );
  const requestedName = `${requestedUser.first_name} ${requestedUser.last_name}`;

  if (status == "denied") {
    // Notify requesting user of denial
    const requestDeniedNotification = {
      id: Date.now() + Math.random(),
      type: "friend-request-update",
      status: "denied",
      from: user._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };
    requestingUser.notifications.push(requestDeniedNotification);

    // Send a webpush Notification to other users as well
    this.webpushNotify([requestingUser], {
      title: "Friend Request Denied",
      body: `${requestedName} denied your friend request`,
    });
  } else {
    // Notify requesting user of acceptance
    const requestAcceptedNotification = {
      id: Date.now() + Math.random(),
      type: "friend-request-update",
      status: "accepted",
      from: user._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };
    requestingUser.notifications.push(requestAcceptedNotification);

    // Send a webpush Notification to other users as well
    this.webpushNotify([requestingUser], {
      title: "Friend Request Accepted",
      body: `${requestedName} accepted your friend request!`,
    });

    // Add users to eachother's friends list
    requestingUser.friends.push(user);
    user.friends.push(requestingUser);
  }

  // Clear notification for user
  user.notifications = user.notifications.filter(
    (n) => n.id != notification.id
  );

  await user.save();
  await requestingUser.save();

  this.pushUserUpdate([user, requestingUser]);

  await this.populateUser(user);
};

module.exports.findNonOutingChat = (user, withUsers) => {
  const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length != arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].toString() != arr2[i].toString()) {
        return false;
      }
    }
    return true;
  };

  const foundChat = user.chats.find(
    (c) =>
      c.users &&
      arraysAreEqual(c.users, [user._id, ...withUsers.map((wu) => wu._id)])
  );

  return foundChat;
};

module.exports.genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

module.exports.getTotalUnreadMessages = (user) => {
  const getUnreadChatMessages = (user, chat) => {
    const lastRead = chat?.last_read;
    if (!lastRead) {
      return 0;
    } else {
      if (lastRead[user._id] === "initialized") {
        return chat.messages.length;
      }
      const lastReadMessage = chat?.messages.find(
        (m) => m.id === lastRead[user._id]
      );
      const lastReadMessageIndex = chat?.messages.indexOf(lastReadMessage);
      if (!lastReadMessage) {
        return 0;
      } else {
        return lastReadMessageIndex;
      }
    }
  };

  return user?.chats
    ?.filter((c) =>
      c.outing
        ? c.outing.users.find((uid) => uid.toString() === user._id.toString())
        : true
    )
    .reduce((count, chat) => (count += getUnreadChatMessages(user, chat)), 0);
};

module.exports.outingIsPending = (user, outing) => {
  return (
    outing.users.find((uid) => uid.toString() == user._id.toString()) &&
    outing.users.length !== outing.completions.length
  );
};

module.exports.socketCors = (inDevelopment) => {
  return inDevelopment
    ? {
        origin: "http://localhost:3000",
        credentials: "include",
      }
    : {};
};

module.exports.onSocketConnection = (socket) => {
  try {
    // Message sent handler
    socket.on("message-sent", async (data) => {
      const chat = await Chat.findById(data.chat._id);
      await chat.populate("outing");

      // Only add message if it has not been added
      if (!chat.messages.find((m) => m.id == data.message.id)) {
        chat.messages.unshift(data.message);
        chat.touched = Date.now();

        // Make sure last_read for all users is this message if it is the first message
        if (chat.messages.length == 1) {
          const chatUsers = chat.outing ? chat.outing.users : chat.users;
          for (let usr of chatUsers) {
            const usrID = usr._id ? usr._id.toString() : usr.toString();
            if (!chat.last_read[usrID]) {
              chat.last_read[usrID] = "initialized";
              chat.markModified("last_read");
            }
          }
        }
        await chat.save();

        socket.broadcast
          .to(chat._id.toString())
          .emit("new-message", { message: data.message, chat });

        let chatUsers = chat.outing ? chat.outing.users : chat.users;
        // Send websocket update to client to re-download session user from server
        this.pushUserUpdate(chatUsers);

        // Send webpush notification to all users other than sending user
        const sender = await User.findById(
          data.message.user._id
            ? data.message.user._id.toString()
            : data.message.user.toString()
        );
        const payload = {
          title: `${sender.first_name} ${sender.last_name} to ${
            chat.outing ? chat.outing.name : "Chat"
          }`,
          body: data.message.message,
        };

        this.webpushNotify(
          // Filter sender out of chat users list for notification sending
          chatUsers.filter((u) =>
            u._id
              ? u._id.toString() !== sender._id.toString()
              : u.toString() !== sender._id.toString()
          ),
          payload
        );
      }
    });

    // Join connection to a room
    socket.on("join-room", (room) => {
      socket.join(room);
    });

    // Echo message handler
  } catch (err) {
    console.log(err);
  }
};
