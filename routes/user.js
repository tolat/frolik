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

router.get("/:id/photo/:key", reqAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if(!user.photos.find(photo => photo === req.params.key)){
      return res.status(404).send("Photo with given key not found");
    }

    // Download image stream from S3 and pipe into response
    downloadFromS3(process.env.AWS_DEV_BUCKET, req.params.key)
      .then((imageStream) => imageStream.pipe(res))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id/profile-picture", reqAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Download image stream from S3 and pipe into response
    downloadFromS3(process.env.AWS_DEV_BUCKET, user.profile_picture)
      .then((imageStream) => imageStream.pipe(res))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});

const timeOperation = async (fun, name) => {
  let start = Date.now();
  const result = await fun();
  let end = Date.now();
  console.log(`"${name} request took: `, end - start, "ms");
  return result;
};

module.exports = router;
