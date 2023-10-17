const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const { reqAuthenticated } = require("../utils/middleware");

const router = express.Router({ mergeParams: true });

router.post("/friend", reqAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if(!user){
    res.sendStatus(400)
  }
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
});

router.post("/profile-picture", reqAuthenticated, async (req, res) => {
    
});

module.exports = router;
