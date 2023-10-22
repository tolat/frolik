const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const { reqAuthenticated } = require("../utils/middleware");
const fs = require("fs");
const path = require("path");
const { downloadFromS3, getSignedURLFromS3 } = require("../utils/S3");

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
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    flake: user.flake,
    outings: strippedOutings,
    status: user.status,
  };
  res.send({ friendData });
});

router.post("/profile-picture", reqAuthenticated, async (req, res) => {
  const user = await User.findById(req.body.userID);
  
  // Send image data as string to client for storage in store
  const imageStream = await downloadFromS3(
    process.env.AWS_DEV_BUCKET,
    user.profile_picture
  );
  const imageDataString = await imageStream.transformToString("base64");

  res.send({ imageDataString });
});

router.post("/photos", reqAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userID });

  res.send({
    photos: [],
  });
});

module.exports = router;
