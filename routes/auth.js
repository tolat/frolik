const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const fs = require("fs/promises");

const router = express.Router({ mergeParams: true });

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  await user.populate("outings");
  await user.populate("outings.activity");
  await user.populate("outings.users");
  await user.populate("outings.users.outings");
  await user.populate("outings.users.outings.activity");

  if (req.isAuthenticated()) {
    res.send({ user });
  }
});

router.post("/check", async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    const user = await User.findOne({ username: req.session.passport.user });

    await user.populate("outings");
    await user.populate("outings.activity");
    await user.populate("outings.users");
    await user.populate("outings.users.outings");
    await user.populate("outings.users.outings.activity");

    res.send({ isAuthenticated, user });
  } else {
    res.send({ isAuthenticated });
  }
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.send({ success: true });
  });
});


module.exports = router;
