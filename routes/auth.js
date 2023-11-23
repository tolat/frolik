const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const { populateUser, populateFriends } = require("../utils/utils");
const { tryCatch } = require("../utils/middleware");

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

module.exports = router;
