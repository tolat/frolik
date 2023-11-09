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

// Populates an array with stripped down version of friends
module.exports.populateFriends = async (friends) => {
  let populatedFriends = [];
  for (friend of friends) {
    const friendUser = await User.findById(friend);
    await friendUser.populate("outings");
    await friendUser.populate("outings.activity");

    const strippedOutings = [];
    for (outing of friendUser.outings) {
      strippedOutings.push({
        activity: { category: outing.activity.category },
      });
    }

    const friendData = {
      _id: friendUser._id,
      first_name: friendUser.first_name,
      last_name: friendUser.last_name,
      flake: friendUser.flake,
      outings: strippedOutings,
      status: friendUser.status,
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
  for (outing of user.outings) {
    for (photoKey of outing.photos) {
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
  const newNotification = {
    id: Date.now() + Math.random(),
    type: "outing-invite-update",
    status,
    userID: user._id.toString(),
    outing: outing._id.toString(),
    created: new Date(Date.now()),
    active: true,
  };
  outingCreator.notifications.push(newNotification);

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
