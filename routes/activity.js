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
const { getSignedURLFromS3 } = require("../utils/S3");

const router = express.Router({ mergeParams: true });

router.get(
  "/get-all",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findOne({
      username: req.session.passport.user,
    }).populate("activities");

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
        { $nor: [{ created_by: { $exists: true } }, { created_by: user }] },
      ],
    });

    // Get user created activities
    for (let activity of user.activities) {
      if (!activities.find((a) => a._id.toString() === activity._id.toString()))
        activities.push(activity);
    }

    let activitiesWithPhotos = [];
    const numPhotos = 1;
    for (let activity of activities) {
      // set up for finding up to 6 random user photos for the activity
      let photos = [];
      let remainingOutings = activity.outings;

      // Loop until we run out of outings or we fill up with photos
      while (photos.length < 6 && remainingOutings && remainingOutings[0]) {
        const randIndex = Math.floor(Math.random() * remainingOutings.length);
        const outing = await Outing.findById(remainingOutings[randIndex]);
        // Add up to 6 photos from this outing
        for (let i = 0; i < outing.photos.length && i < 6; i++) {
          // Download image signed url from s3
          const url = await getSignedURLFromS3(
            process.env.AWS_BUCKET,
            outing.photos[i].key
          );
          photos.push(url);
        }

        // Remove this outing from remaining outings
        remainingOutings.splice(randIndex, 1);
      }

      let newActivity = JSON.parse(JSON.stringify(activity));
      newActivity.photos =
        photos.length > numPhotos ? photos.slice(0, numPhotos) : photos;
      activitiesWithPhotos.push(newActivity);
    }

    res.send({ activities: activitiesWithPhotos });
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
    activity.created_by = user;
    user.activities.push(activity);
    await user.save();
    await activity.save();

    pushUserUpdate([user]);

    res.send({ activity });
  })
);

// Delete a custom activity
router.post(
  "/delete",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.body.userID);
    const activity = new Activity(req.body.activity);

    if (!activity.created_by.toString() == user._id.toString()) {
      res.status(406).send({
        header: `Could not delete activities`,
        message: `You can only delete activities you created.`,
      });
      return;
    }

    user.activities = user.activities
      .map((a) => a.toString())
      .filter((aid) => aid !== activity._id.toString());
    await user.save();
    //await Activity.findByIdAndDelete(activity._id.toString());

    pushUserUpdate([user]);
    res.sendStatus(200);
  })
);

module.exports = router;
