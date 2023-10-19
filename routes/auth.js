const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const fs = require("fs/promises");
const { reqAuthenticated, logIncoming } = require("../utils/middleware");

const router = express.Router({ mergeParams: true });

// Populates an array with stripped down version of friends
const populateFriends = async (friends) => {
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
    };

    populatedFriends.push(friendData);
  }

  return populatedFriends;
};

// Generic user population
const populateUser = async (user) => {
  await user.populate("outings");
  await user.populate("outings.activity");
  await user.populate("outings.users");
  await user.populate("outings.users.outings");
  await user.populate("outings.users.outings.activity");
};

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  // Populate user
  await populateUser(user);

  // Get stripped down populated friends list
  const populatedFriends = await populateFriends(user.friends);

  res.send({ user, populatedFriends });
});

router.post("/check", async (req, res) => {
  if(req.isAuthenticated()){
  let user = await User.findOne({ username: req.session.passport.user });

  // Populate user
  await populateUser(user);

  // Get stripped down populated friends list
  const populatedFriends = await populateFriends(user.friends);

  res.send({ user, populatedFriends });
  }else{
    res.send({})
  }
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.send({ success: true });
  });
});

module.exports = router;
