const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const { reqAuthenticated } = require("../utils/middleware");
const fs = require("fs");
const path = require("path");

const router = express.Router({ mergeParams: true });

router.post("/friend", reqAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  if (!user) {
    res.sendStatus(400);
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
    status: user.status,
  };
  res.send({ friendData });
});

router.post("/profile-picture", reqAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });
  const picUrl = `${process.env.SERVER}/static/images/${user.profile_picture}`;

  res.send({ url: picUrl });
});

router.post("/photos", reqAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });

  // ** CHANGE WHEN DOWNLOADING FROM S3
  let photos = await fs.readdirSync(
    path.join(__dirname, "../client/public/images/sampleUserPhotos/")
  );
  res.send({
    photos: photos
      .map((p) => `${process.env.SERVER}/static/images/sampleUserPhotos/${p}`)
      .slice(1),
  });
  // ** CHANGE WHEN DOWNLOADING FROM S3
});

module.exports = router;
