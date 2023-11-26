const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const {
  reqAuthenticated,
  tryCatch,
  sameUserOnly,
} = require("../utils/middleware");
const { pushUserUpdate } = require("../utils/utils");

const router = express.Router({ mergeParams: true });

router.get(
  "/get-all",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const activities = await Activity.find({});
    const user = await User.findOne({ username: req.session.passport.user });
    const localActivities = activities.filter(
      (a) => a.location == "Global" || a.location == user.location
    );
    res.send({ activities: localActivities });
  })
);

// Create new custon activity
router.post(
  "/create",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.body.userID);
    const activity = new Activity(req.body.activity);
    activity.created_by = user._id;
    user.activities.push(activity)
    await user.save()
    await activity.save();

    pushUserUpdate([user]);

    res.send({ activity });
  })
);

module.exports = router;
