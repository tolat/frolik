const passport = require("passport");
const User = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const crypto = require("crypto");
const sha256 = (t) => crypto.createHash("sha256").update(String(t)).digest("hex");
const rateLimit = require("express-rate-limit");
const { populateUser, populateFriends, sendEmail } = require("../utils/utils");
const { tryCatch } = require("../utils/middleware");
const {
  genResetPasswordEmail: resetPassword,
  genVerifyAccountEmail: verifyEmail,
} = require("../utils/emailTemplates");

const router = express.Router({ mergeParams: true });

// Rate limiters for sensitive auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { header: "Too Many Attempts", message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { header: "Too Many Attempts", message: "Too many password reset requests. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/login",
  loginLimiter,
  passport.authenticate("local"),
  tryCatch(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    // If user status is pending, don't allow login (and don't leave a session)
    if (user.status?.status == "Pending") {
      await new Promise((resolve) => req.logout(resolve));
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
  resetLimiter,
  tryCatch(async (req, res) => {
    const username = String(req.body.username || "").toLowerCase();
    const user = await User.findOne({ username: username });

    // If user status is pending, don't allow login
    if (!user) {
      res.status(406).send({
        header: "User Not Found",
        message: `We can't find a user with the username you provided!`,
      });
      return;
    }

    // Single-use random token; only its hash is stored. Previously the link was
    // just /reset-password/<userID>, so anyone who knew a user's id (which the
    // API exposes) could reset that user's password.
    const token = crypto.randomBytes(32).toString("hex");
    user.reset_token = { expires: Date.now() + 1000 * 60 * 60, hash: sha256(token) };
    await user.save();

    const link = `${process.env.SERVER}/reset-password/${user._id.toString()}?token=${token}`;
    sendEmail(username, "Reset frolik.ca Password", resetPassword(link));
    if (process.env.NODE_ENV == "development")
      console.log("[dev] password reset link:", link);
    res.sendStatus(200);
  })
);

router.post(
  "/reset-password",
  resetLimiter,
  tryCatch(async (req, res) => {
    const user = mongoose.isValidObjectId(req.body.userID)
      ? await User.findById(req.body.userID)
      : null;

    // If user not found, send unacceptable (406)
    if (!user) {
      res.status(406).send({
        header: "User Not Found",
        message: `We can't find a user with the username you provided!`,
      });
      return;
    }

    if (!req.body.password || String(req.body.password).length < 8) {
      res.status(406).send({
        header: "Password Too Short",
        message: "Passwords must be at least 8 characters.",
      });
      return;
    }

    // Check that the reset token matches and hasn't expired
    const supplied = req.body.token ? sha256(req.body.token) : "";
    const stored = user.reset_token?.hash || "";
    const tokenValid =
      stored.length === supplied.length &&
      stored.length > 0 &&
      crypto.timingSafeEqual(Buffer.from(stored), Buffer.from(supplied));
    if (!tokenValid || !user.reset_token.expires || user.reset_token.expires < Date.now()) {
      res.status(406).send({
        header: "Link Expired",
        message: "This password reset link has expired. Please request a new one.",
      });
      return;
    }

    // Safely update password using passport-local-mongoose's setPassword()
    await user.setPassword(req.body.password);
    user.reset_token = undefined;
    await user.save();

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

    // If user is already verified, don't resend
    if (user.status.status !== "Pending") {
      res.status(406).send({
        header: `Could not send email`,
        message: `User ${req.body.username} has already been verified.`,
      });
      return;
    }

    // Send email confirmation link
    const link = `${process.env.SERVER}/user/${user._id.toString()}/verify`;
    sendEmail(req.body.username, "Verify frolik.ca Email", verifyEmail(link));

    res.sendStatus(200);
  })
);

module.exports = router;
