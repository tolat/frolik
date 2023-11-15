const User = require("../models/user");
const Chat = require("../models/chat");
const Outing = require("../models/outing");
const nodemailer = require("nodemailer");
const io = require("../server");

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require("unique-names-generator");
const outing = require("../models/outing");

// Populates an array with stripped down version of friends
module.exports.populateFriends = async (friends) => {
  let populatedFriends = [];
  for (friend of friends) {
    const friendUser = await User.findById(friend._id || friend);
    await friendUser.populate("outings");
    await friendUser.populate("outings.activity");

    let strippedOutings = [];
    for (let outing of friendUser.outings) {
      strippedOutings.push({
        activity: { category: outing.activity.category },
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
  await user.populate("outings");
  await user.populate("outings.activity");
  await user.populate("outings.users");
  await user.populate("outings.users.outings");
  await user.populate("outings.users.outings.activity");
  await user.populate("outings.invited");
  await user.populate("outings.invited.outings");
  await user.populate("outings.invited.outings.activity");
  await user.populate("chats");
  await user.populate("chats.outing");
};

module.exports.sendEmail = async (to, subject, text) => {
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
      text,
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
  const outingCreator = await User.findById(outing.created_by);
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
    await outing.populate("chat")
    outing.chat.last_read[user._id] = false

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
  for (user of users) {
    io.to(user._id ? user._id.toString() : user.toString()).emit("update-user");
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