const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const { reqAuthenticated } = require("../utils/middleware");

const router = express.Router({ mergeParams: true });

router.get("/get-all", reqAuthenticated, async (req, res) => {
  const activities = await Activity.find({});
  const user = await User.findOne({ username: req.session.passport.user });
  const localActivities = activities.filter(
    (a) => a.location == "Global" || a.location == user.location
  );
  res.send({ activities: localActivities });
});

module.exports = router;
