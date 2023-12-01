const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const {
  populateUser,
  populateFriends,
  genRanHex,
  sendEmail,
} = require("../utils/utils");
const { tryCatch } = require("../utils/middleware");
const { createEmail, genResetPasswordEmail: resetPassword, genVerifyAccountEmail: verifyEmail } = require("../utils/emailTemplates");

const router = express.Router({ mergeParams: true });

router.post(
  "/login",
  passport.authenticate("local"),
  tryCatch(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    // If user status is pending, don't allow login
    if (user.status.status == "Pending") {
      res.status(406).send({
        header: "Email Verification Required",
        message: `Check your email at ${req.body.username} for a verification link.`,
      });
      return;
    }

    // Populate user
    await populateUser(user);

    // Get stripped down populated friends list
    const populatedFriends = await populateFriends(user.friends);

    res.send({ user, populatedFriends });
  })
);

router.get(
  "/check",
  tryCatch(async (req, res) => {
    if (req.isAuthenticated()) {
      let user = await User.findOne({ username: req.session.passport.user });

      // Populate user
      await populateUser(user);

      // Get stripped down populated friends list
      const populatedFriends = await populateFriends(user.friends);

      res.send({ user, populatedFriends });
    } else {
      res.send({});
    }
  })
);

router.get("/logout", (req, res) => {
  try {
    req.logout(() => {
      res.sendStatus(200);
    });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/send-reset-link",
  tryCatch(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    // If user status is pending, don't allow login
    if (!user) {
      res.status(406).send({
        header: "User Not Found",
        message: `We can't find a user with the username you provided!`,
      });
      return;
    }

    // Send email with reset link
    const link = `${process.env.SERVER}/reset-password/${user._id.toString()}`;
    sendEmail(
      req.body.username,
      "Reset frolik.ca Password",
      resetPassword(link)
    );

    user.reset_token = { expires: Date.now() + 1000 * 60 * 60 * 10 };
    await user.save();
    res.sendStatus(200);
  })
);

router.post(
  "/reset-password",
  tryCatch(async (req, res) => {
    const user = await User.findById(req.body.userID);

    // If user not found, send unacceptable (406)
    if (!user) {
      res.status(406).send({
        header: "User Not Found",
        message: `We can't find a user with the username you provided!`,
      });
      return;
    }

    // Create new user with new password but same _id
    let newUser = new User(JSON.parse(JSON.stringify(user)));
    newUser._id = user._id.toString();
    await User.deleteOne({ _id: user._id.toString() });
    await User.register(newUser, req.body.password);

    res.sendStatus(200);
  })
);

router.post(
  "/resend-verification-email",
  tryCatch(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    // If user not found, send unacceptable (406)
    if (!user) {
      res.status(406).send({
        header: "User Not Found",
        message: `We can't find a user with the username you provided!`,
      });
      return;
    }

    // If user not found, send unacceptable (406)
    if (!user.status.status === "Pending") {
      res.status(406).send({
        header: `Could not send email`,
        message: `User ${req.body.username} has already been verified.`,
      });
      return;
    }

    // Send email confirmation link
    const link = `${process.env.SERVER}/user/${user._id.toString()}/verify`;
    sendEmail(
      req.body.username,
      "Verify frolik.ca Email",
      verifyEmail(link)
    );

    res.sendStatus(200);
  })
);

module.exports = router;
