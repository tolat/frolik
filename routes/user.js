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
const {
  populateUser,
  populateFriends,
  sendEmail,
  getPhotosFromOutings,
} = require("../utils/utils");
const sharp = require("sharp");

const router = express.Router({ mergeParams: true });

// Get a photo with given key for user with given id
router.get(
  "/:id/photo/:key",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).populate("outings");
    const photoKeys = getPhotosFromOutings(user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!photoKeys.find((photo) => photo === req.params.key)) {
      return res.status(404).send("Photo with given key not found");
    }

    // Download image stream from S3 and pipe into response
    downloadFromS3(process.env.AWS_BUCKET, req.params.key)
      .then((imageStream) => imageStream.pipe(res))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

// Get User Profile Picture
router.get(
  "/:id/profile-picture",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Download image stream from S3 and pipe into response
    downloadFromS3(process.env.AWS_BUCKET, user.profile_picture.key)
      .then((imageStream) => imageStream.pipe(res))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

// Upload user profile picture
router.post(
  "/:id/profile-picture",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
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

    // Only upload new image if it has been sent
    if (req.body.photoString) {
      // Resize/compress image before upload
      const imageBuffer = Buffer.from(req.body.photoString, "base64");
      const reducedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .withMetadata()
        .toBuffer();
      const imageString = reducedImageBuffer.toString("base64");

      // Upload image to S3
      uploadToS3(process.env.AWS_BUCKET, req.body.key, imageString)
        .then((response) => {
          res.send({ user, populatedFriends });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          res.status(500).send("Internal Server Error");
        });
    } else {
      res.send({ user, populatedFriends });
    }
  })
);

router.post(
  "/:id/profile-data",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;

    for (let key in req.body) {
      if (req.body[key] || req.body[key] == "") {
        key == "status"
          ? (user.status = {
              status: req.body.status,
              updated: Date.now(),
            })
          : (user[key] = req.body[key]);
      }
    }

    await user.save();

    res.send({ user });
  })
);

router.post(
  "/create",
  tryCatch(async (req, res) => {
    const userData = req.body.user;

    //Send back error code if user already exists
    if (await User.findOne({ username: userData.username })) {
      res
        .status(406)
        .send(`User with username ${userData.username} already exists`);
    } else {
      // Else create new user and upload photo
      const user = new User(userData);
      await User.register(user, userData.password);

      // Send email confirmation link
      const link = `${process.env.SERVER}/user/${user._id.toString()}/verify`;
      sendEmail(userData.username, "Confirm Email", link);
      user.status = { status: "Pending", updated: Date.now() };

      // Upload image to S3
      uploadToS3(
        process.env.AWS_BUCKET,
        user.profile_picture.key,
        req.body.photoString
      )
        .then((response) => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          res.status(500).send("Internal Server Error");
        });
    }
  })
);

router.get(
  "/:id/verify",
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    user.status = { status: "Ready", updated: Date.now() };

    console.log(user);

    await user.save();

    res.redirect("/login");
  })
);

router.get(
  "/:id/matches",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const validStatuses = ["Ready", "Searching"];
    let allAvailable = await User.find({
      "status.status": { $in: validStatuses },
    });

    // Filter out friends and this user
    allAvailable = allAvailable.filter(
      (u) =>
        !user.friends.includes(u._id.toString()) && u.username != user.username
    );

    // If no full matches set, generate matches set with at most 5 matches
    if (!user.matches || !user.matches[0]) {
      user.matches = [];
      // Pick 5 available users at random
      for (let i = 0; i < 5; i++) {
        if (allAvailable.length > 0) {
          const index = parseInt(
            (Math.random() * 1000000) % allAvailable.length
          );
          console.log(index)
          user.matches.push({ user: allAvailable[index], updated: Date.now() });
          allAvailable.splice(index, 1);
        } 
      }
    } else {
      // Replace or delete any matches that are 24 hrs or older
      for (match of user.matches) {
        if (Date.now() - new Date(match.updated).getTime() > 86400000) {
          const replaceIndex = user.matches.indexOf(match);
          if (allAvailable.length > 0) {
            const newIndex = (Math.random() * 1000000) % allAvailable.length;
            user.matches[replaceIndex] = {
              user: allAvailable[newIndex],
              updated: Date.now(),
            };
            allAvailable.splice(newIndex, 1);
          } else {
            user.matches.splice(replaceIndex, 1);
          }
        }
      }
    }
    await user.save();

    let matches = [];
    // Just send matched users back to the server
    for (match of user.matches) {
      let matchedUser = await User.findById(match.user)
      await matchedUser.populate('outings')
      await matchedUser.populate('outings.activity')
      matches.push(matchedUser);
    }

    res.send({ matches });
  })
);

module.exports = router;
