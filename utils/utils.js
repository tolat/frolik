const User = require("../models/user");
const Chat = require("../models/chat")
const nodemailer = require("nodemailer");

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
