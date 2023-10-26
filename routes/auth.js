const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const fs = require("fs/promises");
const { populateUser, populateFriends } = require("../utils/utils");
const { tryCatch } = require("../utils/middleware");
const Globals = require("../models/globals");

const router = express.Router({ mergeParams: true });

router.post(
  "/login",
  passport.authenticate("local"),
  tryCatch,
  async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const globals = await Globals.findOne({});

    // Populate user
    await populateUser(user);

    // Get stripped down populated friends list
    const populatedFriends = await populateFriends(user.friends);

    res.send({ user, populatedFriends, globals });
  }
);

router.get("/check", tryCatch, async (req, res) => {
  if (req.isAuthenticated()) {
    let user = await User.findOne({ username: req.session.passport.user });
    const globals = await Globals.findOne({});

    // Populate user
    await populateUser(user);

    // Get stripped down populated friends list
    const populatedFriends = await populateFriends(user.friends);

    res.send({ user, populatedFriends, globals });
  } else {
    res.send({});
  }
});

router.get("/logout", tryCatch, (req, res) => {
  req.logout(() => {
    res.sendStatus(200);
  });
});

module.exports = router;
