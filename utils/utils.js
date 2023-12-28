const User = require("../models/user");
const Chat = require("../models/chat");
const Outing = require("../models/outing");
const nodemailer = require("nodemailer");
const io = require("../server");
const webpush = require("web-push"); // Add this line for web-push

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require("unique-names-generator");
const outing = require("../models/outing");
const { genOutingInviteAcceptedEmail } = require("./emailTemplates");

// Populates an array with stripped down version of friends
module.exports.populateFriends = async (friends) => {
  let populatedFriends = [];
  for (friend of friends) {
    const friendUser = await User.findById(friend._id || friend);
    await friendUser.populate({
      path: "outings",
      populate: { path: "activity" },
    });

    let strippedOutings = [];
    for (let outing of friendUser.outings) {
      strippedOutings.push({
        activity: outing.activity,
        completions: outing.completions,
        users: outing.users,
        photos: outing.photos,
        flakes: outing.flakes,
      });
    }

    const friendData = {
      _id: friendUser._id,
      first_name: friendUser.first_name,
      last_name: friendUser.last_name,
      outings: strippedOutings,
      status: friendUser.status,
      location: friendUser.location,
      tagline: friendUser.tagline,
      profile_picture: friendUser.profile_picture,
    };

    populatedFriends.push(friendData);
  }

  return populatedFriends;
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

module.exports.sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDMAIL_FROM,
        pass: process.env.SENDMAIL_FROM_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDMAIL_FROM,
      to,
      subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports.getPhotosFromOutings = (user) => {
  let photoKeys = [];
  for (let outing of user.outings) {
    for (photoKey of outing.photos.map((p) => p.key)) {
      photoKeys.push(photoKey);
    }
  }
  return photoKeys;
};

module.exports.generateUniqueName = () => {
  // Generate random unique name
  let uniqueName = [
    ...uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
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
  // if user is accepting,
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

  // Make a new notification to send to outing creator
  let outingCreator = await User.findById(outing.created_by);
  if (
    outing.users.find((u) =>
      u._id
        ? u._id.toString() == outingCreator._id.toString()
        : u.toString() == outingCreator._id.toString()
    )
  ) {
    const newInviteAcceptedNotification = {
      id: Date.now() + Math.random(),
      type: "outing-invite-update",
      status,
      userID: user._id.toString(),
      outing: outing._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };
    outingCreator.notifications.push(newInviteAcceptedNotification);
  }

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

    // Don's send join notification to the outing creator
    for (usr of outing.users) {
      const foundUsr = await User.findById(usr);
      if (
        foundUsr._id.toString() == user._id.toString() ||
        foundUsr._id.toString() == outingCreator._id.toString()
      ) {
        continue;
      }
      foundUsr.notifications.push(newOutingJoinedNotification);
      await foundUsr.save();
    }

    // send email notification to outing creator
    // Send notification email to user
    await outingCreator.populate({
      path: "chats",
      populate: {
        path: "outing",
      },
    });
    await outing.populate("activity");
    const outingCreatorUnreadMessages =
      this.getTotalUnreadMessages(outingCreator);
    this.sendEmail(
      outingCreator.username,
      "Outing Invitation Accepted",
      genOutingInviteAcceptedEmail(
        user,
        outing,
        outingCreator.notifications.length,
        outingCreatorUnreadMessages
      )
    );
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

module.exports.pushUserUpdate = async (users) => {
  for (let user of users) {
    const usrID = user._id ? user._id.toString() : user.toString();
    io.to(usrID).emit("update-user");
  }
};

module.exports.webpushNotify = async (users, payload) => {
  console.log("sending notification!!");
  for (let user of users) {
    // Get user form DB
    const userID = user._id ? user._id.toString() : user.toString();
    user = await User.findById(userID);

    // Send webpush noticication as well if webpushPayload is given
    if (user.pushSubscription) {
      webpush
        .sendNotification(user.pushSubscription, JSON.stringify(payload))
        .catch((error) => {
          console.error("Error sending notification:", error);
        });
    }
  }
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
      c.outing ? !c.outing.flakes.find((uid) => uid === user._id) : true
    )
    .reduce((count, chat) => {
      return count + getUnreadChatMessages(user, chat);
    }, 0);
};

module.exports.outingIsPending = (user, outing) => {
  return (
    outing.users.find((uid) => uid.toString() == user._id.toString()) &&
    outing.users.length !== outing.completions.length
  );
};
