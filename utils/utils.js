const User = require("../models/user");
const Chat = require("../models/chat");
const nodemailer = require("nodemailer");
// The socket server, looked up when first used: requiring server.js at load
// time started the whole server (and its jobs) in any script that used these
// helpers, e.g. scripts/send-weekly-nudge.js
const getIO = () => require("../server");
const webpush = require("web-push");
const { forUser } = require("./i18n");

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} = require("unique-names-generator");

// Populates an array with stripped down version of friends
// Uses Promise.all for parallel DB queries instead of sequential loop (N+1 fix)
module.exports.populateFriends = async (friends) => {
  const populated = await Promise.all(
    (friends || []).map(async (friend) => {
      if (!friend) return null;
      const friendUser = await User.findById(friend._id || friend);
      // Skip users that have been deleted instead of crashing the request
      if (!friendUser) return null;
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
  return populated.filter(Boolean);
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

// Decode a base64 data URL (any image type) into a Buffer. Previously callers
// did photoString.slice(23), which only works for "data:image/jpeg;base64,".
module.exports.decodeDataURL = (dataURL) => {
  const str = String(dataURL || "");
  const comma = str.indexOf(",");
  return Buffer.from(comma >= 0 ? str.slice(comma + 1) : str, "base64");
};

// {lat, lng} from the client → GeoJSON point, or null if invalid
module.exports.toGeoPoint = (geo) => {
  const lat = Number(geo?.lat);
  const lng = Number(geo?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { type: "Point", coordinates: [lng, lat] };
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
// Alerts stay on the Alerts page for good: answering one (accept / deny /
// decline / expire) records the answer on it and marks it read, instead of
// deleting it. Pending = no status yet.
const markNotificationAnswered = (user, notification, status) => {
  if (!notification || notification.id == null) return;
  const now = new Date();
  user.notifications = (user.notifications || []).map((n) =>
    n && String(n.id) === String(notification.id)
      ? { ...n, status, read: true, read_at: n.read_at || now }
      : n
  );
  user.markModified?.("notifications");
};
module.exports.markNotificationAnswered = markNotificationAnswered;

module.exports.handleOutingInviteAction = async (
  notification,
  user,
  outing,
  status
) => {
  // Keep the invite, answered ("accepted" shows as Joined, "denied" as
  // Declined)
  markNotificationAnswered(user, notification, status);

  // Remove user from outing invited list
  outing.invited.splice(
    outing.invited.map((u) => u.toString()).indexOf(user._id.toString()),
    1
  );

  // If status is accepted, add user to Outing users list and
  // add outing to invited user's outing list
  if (status == "accepted") {
    outing.users.push(user);
    // Invitees already have the chat; don't list it twice
    if (!user.chats.some((c) => idOf(c) === idOf(outing.chat))) {
      user.chats.push(outing.chat);
    }
    user.outings.push(outing);
  } else if (outing.chat) {
    // Declined: the outing chat goes too
    user.chats = user.chats.filter((c) => idOf(c) !== idOf(outing.chat));
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
    for (const usr of outing.users) {
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
        title: forUser("push.outingJoined.title"),
        body: forUser("push.outingJoined.body", {
          name: `${user.first_name} ${user.last_name}`,
          outing: outing.name,
        }),
      });
    }
  } else {
    const createdByUser = await User.findById(outing.created_by);

    // Send websocket push update to outing users
    this.pushUserUpdate(outing.users);

    // Send webpush Notification
    this.webpushNotify([createdByUser], {
      title: forUser("push.inviteDenied.title"),
      body: forUser("push.inviteDenied.body", {
        name: `${user.first_name} ${user.last_name}`,
        outing: outing.name,
      }),
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
    const io = getIO();
    if (io?.to) io.to(usrID).emit("update-user");
  }
};

// All push subscriptions for a user (every device), de-duplicated
const userSubscriptions = (u) => {
  const subs = [...(u.pushSubscriptions || [])];
  if (u.pushSubscription?.endpoint) subs.push(u.pushSubscription);
  const seen = new Set();
  return subs.filter((s) => s?.endpoint && !seen.has(s.endpoint) && seen.add(s.endpoint));
};
module.exports.userSubscriptions = userSubscriptions;

// Notification emails (invites etc.) only go to people without push
// notifications on: once a device is subscribed, push replaces them. Account
// emails (verify, password reset) always send.
module.exports.wantsNotificationEmails = (u) => userSubscriptions(u).length === 0;

// payload: { title, body, url?, tag? } — url is where tapping the
// notification takes the user (defaults to Alerts). title/body may be
// strings or (user) => string (e.g. i18n forUser(key, vars)) so each
// recipient gets the text in their own language.
module.exports.webpushNotify = async (users, payload) => {
  const { title, body: text, ...rest } = payload;
  const resolve = (v, u) => (typeof v === "function" ? v(u) : v);
  await Promise.all(
    users.map(async (user) => {
      const userID = user._id ? user._id.toString() : user.toString();
      const freshUser = await User.findById(userID).populate({
        path: "chats",
        populate: { path: "outing" },
      });
      if (!freshUser) return;

      const subs = userSubscriptions(freshUser);
      if (!subs.length) return;

      const body = JSON.stringify({
        url: "/alerts",
        ...rest,
        title: resolve(title, freshUser),
        body: resolve(text, freshUser),
        notificationCount:
          (this.getTotalUnreadMessages(freshUser) || 0) +
          this.unreadNotificationCount(freshUser),
      });

      // Send to every device; 404/410 = expired or unsubscribed, so prune it
      const dead = [];
      await Promise.all(
        subs.map((sub) =>
          webpush
            .sendNotification(sub, body, { TTL: 60 * 60 * 24 })
            .catch((error) => {
              if (error.statusCode === 410 || error.statusCode === 404) {
                dead.push(sub.endpoint);
              } else {
                console.error("Error sending push notification:", error.message);
              }
            })
        )
      );
      if (dead.length) {
        const update = { $pull: { pushSubscriptions: { endpoint: { $in: dead } } } };
        if (dead.includes(freshUser.pushSubscription?.endpoint)) {
          update.$unset = { pushSubscription: "" };
        }
        await User.updateOne({ _id: freshUser._id }, update);
      }
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
      title: forUser("push.friendRequestDenied.title"),
      body: forUser("push.friendRequestDenied.body", { name: requestedName }),
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
      title: forUser("push.friendRequestAccepted.title"),
      body: forUser("push.friendRequestAccepted.body", { name: requestedName }),
    });

    // Add users to eachother's friends list (once: accepting twice, e.g. a
    // double tap, used to list the same friend several times)
    const has = (list, u) => (list || []).some((f) => (f._id || f).toString() === u._id.toString());
    if (!has(requestingUser.friends, user)) requestingUser.friends.push(user);
    if (!has(user.friends, requestingUser)) user.friends.push(requestingUser);
  }

  // Keep the request on their Alerts page, answered
  markNotificationAnswered(user, notification, status == "denied" ? "denied" : "accepted");

  await user.save();
  await requestingUser.save();

  this.pushUserUpdate([user, requestingUser]);

  await this.populateUser(user);
};

// A chat as this user should see it: messages from before they deleted it
// ("delete for me", user.cleared_chats) are left out. Returns a plain object.
module.exports.chatForUser = (user, chat) => {
  const plain = chat?.toObject ? chat.toObject() : chat;
  if (!plain) return plain;
  const cleared = (user.cleared_chats || []).find(
    (c) => c.chat && c.chat.toString() === plain._id.toString()
  );
  if (!cleared) return plain;
  const after = new Date(cleared.at).getTime();
  return {
    ...plain,
    messages: (plain.messages || []).filter((m) => new Date(m.sent).getTime() > after),
  };
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

  // Same members in any order (a chat the friend started lists them first)
  const wanted = [user._id, ...withUsers.map((wu) => wu._id)]
    .map((id) => id.toString())
    .sort();
  const foundChat = user.chats.find(
    (c) =>
      c.users &&
      !c.outing &&
      arraysAreEqual(c.users.map((id) => (id._id || id).toString()).sort(), wanted)
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
        ? [...c.outing.users, ...(c.outing.invited || [])].find(
            (uid) => uid.toString() === user._id.toString()
          )
        : true
    )
    .reduce((count, chat) => (count += getUnreadChatMessages(user, chat)), 0);
};

module.exports.outingIsPending = (user, outing) => {
  return (
    !outing.date_completed &&
    outing.users.find((uid) => uid.toString() == user._id.toString()) &&
    outing.users.length !== outing.completions.length
  );
};


const idOf = (u) => (u?._id ? u._id.toString() : u?.toString());
// Outing chats include the invitees who haven't answered yet: they can read
// and post from the moment they're invited, until they decline, the invite
// expires or they unfriend the creator (see dropFromOutingChat).
const chatMemberIDs = (chat) =>
  (chat.outing
    ? [...(chat.outing.users || []), ...(chat.outing.invited || [])]
    : chat.users
  ).map(idOf);
module.exports.chatMemberIDs = chatMemberIDs;

// Take the outing chat away from users who are no longer invited and never
// joined (members keep it).
module.exports.dropFromOutingChat = async (outing, userIDs) => {
  if (!outing?.chat || !userIDs?.length) return;
  const members = new Set((outing.users || []).map(idOf));
  const ids = userIDs.map(idOf).filter((id) => id && !members.has(id));
  if (!ids.length) return;
  const chatID = outing.chat._id || outing.chat;
  await User.updateMany(
    { _id: { $in: ids } },
    { $pull: { chats: chatID, archived_chats: chatID } }
  );
};

module.exports.onSocketConnection = async (socket) => {
  // socket.request.user is set by the shared express session + passport
  // (see server.js). Unauthenticated sockets are dropped.
  const sessionUser = socket.request.user;
  if (!sessionUser) {
    socket.disconnect(true);
    return;
  }
  const sessionUserID = sessionUser._id.toString();

  // Auto-join the user's own room and all of their chat rooms so messages are
  // still received after a reconnect.
  socket.join(sessionUserID);
  for (const chatID of sessionUser.chats || []) socket.join(chatID.toString());

  // Message sent handler
  socket.on("message-sent", async (data) => {
    try {
      const text = String(data?.message?.message ?? "").trim();
      const sharedActivityID = data?.message?.activity?._id || data?.message?.activity;
      if (!data?.chat?._id || !data?.message?.id || text.length > 2000) return;
      if (!text && !sharedActivityID) return;

      // A shared activity is stored as a snapshot built from the database,
      // never from what the client sent
      let activity = undefined;
      if (sharedActivityID) {
        const Activity = require("../models/activity");
        const a = await Activity.findById(String(sharedActivityID)).catch(() => null);
        if (!a) return;
        activity = {
          _id: a._id.toString(),
          name: a.name,
          category: a.category,
          location: a.location,
        };
      }

      const chat = await Chat.findById(data.chat._id);
      if (!chat) return;
      await chat.populate("outing");

      // Only chat members may post, and only as themselves
      if (!chatMemberIDs(chat).includes(sessionUserID)) return;
      const message = {
        id: String(data.message.id),
        message: text,
        sent: new Date(),
        user: sessionUserID,
        ...(activity ? { activity } : {}),
      };

      // Only add message if it has not been added
      if (chat.messages.find((m) => m.id == message.id)) return;

      chat.messages.unshift(message);
      chat.touched = Date.now();

      // Make sure last_read for all users is set if it is the first message
      if (chat.messages.length == 1) {
        if (!chat.last_read) chat.last_read = {};
        for (const usrID of chatMemberIDs(chat)) {
          if (!chat.last_read[usrID]) chat.last_read[usrID] = "initialized";
        }
        // The sender has obviously read their own first message
        chat.last_read[sessionUserID] = message.id;
        chat.markModified("last_read");
      }
      await chat.save();

      socket.broadcast
        .to(chat._id.toString())
        .emit("new-message", { message: { ...data.message, ...message }, chat });

      const chatUsers = chatMemberIDs(chat);

      // A new message brings a chat someone deleted "for me" back into their
      // list (still hiding the messages from before they deleted it)
      await User.updateMany(
        { _id: { $in: chatUsers }, chats: { $ne: chat._id } },
        { $addToSet: { chats: chat._id } }
      );

      // A new message brings an archived chat back into everyone's main list
      await User.updateMany(
        { _id: { $in: chatUsers }, archived_chats: chat._id },
        { $pull: { archived_chats: chat._id } }
      );

      // Send websocket update to client to re-download session user from server
      this.pushUserUpdate(chatUsers);

      // Send webpush notification to all users other than sending user
      this.webpushNotify(
        chatUsers.filter((id) => id !== sessionUserID),
        {
          title: chat.outing
            ? forUser("push.chatMessage.title", {
                name: `${sessionUser.first_name} ${sessionUser.last_name}`,
                chat: chat.outing.name,
              })
            : forUser("push.chatMessage.titleDirect", {
                name: `${sessionUser.first_name} ${sessionUser.last_name}`,
              }),
          body:
            text ||
            forUser("push.chatMessage.sharedActivity", { activity: activity?.name }),
          url: `/chat?open=${chat._id.toString()}`,
          tag: `chat-${chat._id.toString()}`,
        }
      );
    } catch (err) {
      console.error("[socket message-sent]", err.message);
    }
  });

  // Join a room — only the user's own room or a chat they belong to
  socket.on("join-room", async (room) => {
    try {
      room = String(room);
      if (room === sessionUserID) return socket.join(room);
      const chat = await Chat.findById(room).populate("outing");
      if (chat && chatMemberIDs(chat).includes(sessionUserID)) socket.join(room);
    } catch (err) {
      // invalid ObjectId etc. — ignore
    }
  });
};

// Alerts the user hasn't opened yet (read ones stay listed under "Read")
module.exports.unreadNotificationCount = (user) =>
  (user?.notifications || []).filter((n) => n && !n.read).length;
