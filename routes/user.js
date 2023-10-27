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
const { downloadFromS3, uploadToS3 } = require("../utils/S3");
const { populateUser, populateFriends } = require("../utils/utils");
const sharp = require("sharp");

const router = express.Router({ mergeParams: true });

// Get a photo with given key for user with given id
router.get("/:id/photo/:key", reqAuthenticated, tryCatch, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.photos.find((photo) => photo === req.params.key)) {
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

// Get User Profile Picture
router.get(
  "/:id/profile-picture",
  reqAuthenticated,
  tryCatch,
  async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Download image stream from S3 and pipe into response
    downloadFromS3(process.env.AWS_DEV_BUCKET, user.profile_picture.key)
      .then((imageStream) => imageStream.pipe(res))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  }
);

// Upload user profile picture
router.post(
  "/:id/profile-picture",
  reqAuthenticated,
  sameUserOnly,
  tryCatch,
  async (req, res) => {
    // Getting user from the sameUserOnly middleware
    const user = req.user;

    user.profile_picture = {
      key: req.body.key,
      crop: req.body.crop,
      zoom: req.body.zoom,
    };

    user.markModified("profile_picture");
    await user.save();

    // Populate user
    await populateUser(user);

    // Get stripped down populated friends list
    const populatedFriends = await populateFriends(user.friends);

    // Resize/compress image before upload
    const imageBuffer = Buffer.from(req.body.photoString, "base64");
    const reducedImageBuffer = await sharp(imageBuffer)
      .resize(350, 350)
      .toBuffer();
    const imageString = reducedImageBuffer.toString("base64");

    // Upload image to S3
    uploadToS3(process.env.AWS_DEV_BUCKET, req.body.key, imageString)
      .then((response) => {
        res.send({ user, populatedFriends });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Internal Server Error");
      });
  }
);

router.post(
  "/:id/profile-data",
  reqAuthenticated,
  sameUserOnly,
  tryCatch,
  async (req, res) => {
    const user = req.user;

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.location = req.body.location;
    user.tagline = req.body.tagline;
    user.status = {
      status: req.body.status,
      updated: Date.now(),
    };

    await user.save();

    res.send({ user });
  }
);

const timeOperation = async (fun, name) => {
  let start = Date.now();
  const result = await fun();
  let end = Date.now();
  console.log(`"${name} request took: `, end - start, "ms");
  return result;
};

module.exports = router;
