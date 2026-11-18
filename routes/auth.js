const passport = require("passport");
const User = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const crypto = require("crypto");
const sha256 = (t) => crypto.createHash("sha256").update(String(t)).digest("hex");
const rateLimit = require("express-rate-limit");
const { populateUser, populateFriends, sendEmail } = require("../utils/utils");
const { tryCatch } = require("../utils/middleware");
const { userLang, tr } = require("../utils/i18n");
const {
  genResetPasswordEmail: resetPassword,
  genVerifyAccountEmail: verifyEmail,
} = require("../utils/emailTemplates");

const router = express.Router({ mergeParams: true });

// Rate limiters for sensitive auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: (req) => ({
    header: req.t("auth.tooManyLogins.header"),
    message: req.t("auth.tooManyLogins.message"),
  }),
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: (req) => ({
    header: req.t("auth.tooManyResets.header"),
    message: req.t("auth.tooManyResets.message"),
  }),
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
        header: req.t("auth.verificationRequired.header"),
        message: req.t("auth.verificationRequired.message", { email: req.body.username }),
        // the app offers a "Resend verification link" button for this one
        action: "resend-verification",
        email: req.body.username,
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
        header: req.t("auth.userNotFound.header"),
        message: req.t("auth.userNotFound.message"),
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
    const lang = userLang(user);
    sendEmail(username, tr(lang, "email.resetPassword.subject"), resetPassword(lang, link));
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
        header: req.t("auth.userNotFound.header"),
        message: req.t("auth.userNotFound.message"),
      });
      return;
    }

    if (!req.body.password || String(req.body.password).length < 8) {
      res.status(406).send({
        header: req.t("auth.passwordTooShort.header"),
        message: req.t("auth.passwordTooShort.message"),
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
        header: req.t("auth.linkExpired.header"),
        message: req.t("auth.linkExpired.message"),
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
        header: req.t("auth.userNotFound.header"),
        message: req.t("auth.userNotFound.message"),
      });
      return;
    }

    // If user is already verified, don't resend
    if (user.status.status !== "Pending") {
      res.status(406).send({
        header: req.t("auth.alreadyVerified.header"),
        message: req.t("auth.alreadyVerified.message", { email: req.body.username }),
      });
      return;
    }

    // Send email confirmation link
    const link = `${process.env.SERVER}/user/${user._id.toString()}/verify`;
    const lang = userLang(user);
    sendEmail(req.body.username, tr(lang, "email.verify.subject"), verifyEmail(lang, link));

    res.sendStatus(200);
  })
);

module.exports = router;
