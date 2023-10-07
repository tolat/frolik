const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");

const router = express.Router({ mergeParams: true });

router.post("/friend", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.body.userID });
    await user.populate("outings");
    await user.populate("outings.activity");

    const strippedOutings = [];
    for (outing of user.outings) {
      strippedOutings.push({ activity: { category: outing.activity.category } });
    }

    const friendData = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      flake: user.flake,
      outings: strippedOutings,
    };
    res.send({ friendData });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
