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
    const user = await User.findOne({ username: req.session.passport.user });

    if (!user) {
      res.status(406).send({
        header: `Could not fetch activities`,
        message: `You must be logged in the see activities.`,
      });
      return;
    }

    let activities = await Activity.find({
      $and: [
        {
          $or: [{ location: "Global" }, { location: user.location }],
        },
        { $nor: [{ created_by: { $exists: true } }, { created_by: user._id }] },
      ],
    });

    for (let activity of user.activities) {
      const foundActivity = await Activity.findById(activity.toString());
      activities.push(foundActivity);
    }


    res.send({ activities });
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
    user.activities.push(activity);
    await user.save();
    await activity.save();

    pushUserUpdate([user]);

    res.send({ activity });
  })
);

module.exports = router;
