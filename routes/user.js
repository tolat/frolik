const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const Chat = require("../models/chat");
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

    console.log(user);

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
          res.sendStatus(200);
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

// Update profile data for a user
router.post(
  "/:id/profile-data",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const profileData = req.body.profileData;
    const photoString = req.body.photoString;

    // Set user profile data
    for (let key in profileData) {
      if (profileData[key] || profileData[key] == "")
        user[key] = profileData[key];
    }

    // Save & Populate user
    await user.save();
    await populateUser(user);

    // Get stripped down populated friends list
    const populatedFriends = await populateFriends(user.friends);

    // Resize/compress image before upload
    const imageBuffer = Buffer.from(photoString, "base64");
    const reducedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 50 })
      .withMetadata()
      .toBuffer();
    const imageString = reducedImageBuffer.toString("base64");

    // Upload image to S3
    uploadToS3(
      process.env.AWS_BUCKET,
      profileData.profile_picture.key,
      imageString
    )
      .then(() => {
        res.send({ user, populatedFriends });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

// Create a new user
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

// email verification route for new users
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

// Gets/updates the daily matched users for a user
router.get(
  "/:id/matches",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    await user.populate('outings')
    const validStatuses = ["Ready", "Searching"];

    // Return if user already has 5+ pending outings
    if(user.outings.filter(o=> o.statu == 'Pending').length >4){
      res.status(406).send('User has too many pending outings')
      return
    }

    // Limit matches to users who have status ready or searching
    let allAvailable = await User.find({
      "status.status": { $in: validStatuses },
    });

    // Populate the available matches user outings
    for (u of allAvailable) {
      await u.populate("outings");
    }

    // Filter out invalid matches
    allAvailable = allAvailable.filter((u) => {
      return (
        // No friends matches
        !user.friends.map((f) => f.toString()).includes(u._id.toString()) &&
        // Don't match same user
        u._id.toString() !== user._id.toString() &&
        // No users with 5 or more pending outings
        u.outings.filter((o) => o.status == "Pending").length < 5 &&
        // No users that are alredy in the user's matches
        !user.matches.find(m => m.user.toString() == u._id.toString())
      );
    });

    // If no full matches set, generate matches set with at most 5 matches
    if (!user.matches || !user.matches[0]) {
      user.matches = [];
      // Pick 5 available users at random
      for (let i = 0; i < 5; i++) {
        if (allAvailable.length > 0) {
          const index = parseInt(
            (Math.random() * 1000000) % allAvailable.length
          );
          console.log(index);
          user.matches.push({ user: allAvailable[index], updated: Date.now() });
          allAvailable.splice(index, 1);
        }
      }
    } else {
      // Replace or delete any invalid matches
      for (match of user.matches) {
        const matchUser = await User.findById(match.user);
        await matchUser.populate("outings");
        if (
          // Match is 24 hrs old or more
          Date.now() - new Date(match.updated).getTime() > 86400000 ||
          // Match status has changed to Busy or Incative
          !validStatuses.includes(matchUser.status.status) ||
          // Match has 5 or more pending outings
          matchUser.outings.filter((o) => o.status == "Pending").length > 4
        ) {
          const replaceIndex = user.matches.indexOf(match);
          // If available matches exists, pull form there
          if (allAvailable.length > 0) {
            const newIndex = parseInt(
              (Math.random() * 1000000) % allAvailable.length
            );
            user.matches[replaceIndex] = {
              user: allAvailable[newIndex],
              updated: Date.now(),
            };
            allAvailable.splice(newIndex, 1);
          }
          // Else just delete the invalid match 
          else {
            user.matches.splice(replaceIndex, 1);
          }
        }
      }
    }
    await user.save();

    let matches = [];
    // Just send matched users back to the server
    for (match of user.matches) {
      let matchedUser = await User.findById(match.user);
      await matchedUser.populate("outings");
      await matchedUser.populate("outings.activity");
      matches.push(matchedUser);
    }

    res.send({ matches });
  })
);

// Get chat and populate it for use in the client
router.get(
  "/:id/chat/:chatid",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const chat = await Chat.findById(req.params.chatid);
    const user = await User.findById(req.params.id);

    if (!user || !chat) {
      res.status(404).send("Resource Not Found");
      return;
    }

    // Send back unauthorized if chatid is not in the user's chats
    if (!user.chats.find((c) => c.toString() == chat._id.toString())) {
      res.status(401).send("User Not Authorized For This Chat");
      return;
    }

    await chat.populate("outing");

    // Populate chat users with stripped down data
    const populatedUsers = await populateFriends(
      chat.outing.users.map((u) => u.toString())
    );

    res.send({ chat, populatedUsers });
  })
);

// Get chat and populate it for use in the client
router.get(
  "/:id/chats/",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send("User Not Found");
      return;
    }

    await user.populate("chats");
    await user.populate("chats.outing");

    // For each chat, populate the outing users with stripped data
    let chatMembersMap = {};
    for (let chat of user.chats) {
      const populatedMembers = await populateFriends(
        chat.outing.users.map((u) => u.toString())
      );
      chatMembersMap[chat._id.toString()] = populatedMembers;
    }

    res.send({ chats: user.chats, chatMembersMap });
  })
);

router.post("/:id/create-outing", reqAuthenticated, async (req, res) => {
  let user = await User.findById(req.params.id);

  // Update outing status and date created
  let outing = req.body;
  outing.status = "Pending";
  outing.date_created = new Date(Date.now());

  const newOuting = new Outing(outing);
  await newOuting.save();
  await newOuting.populate("activity");
  await newOuting.populate("users");
  await newOuting.populate("users.outings");
  await newOuting.populate("users.outings.activity");

  // Add outing to user outings and popualte user for response
  user.outings.push(newOuting);
  await user.save();
  await populateUser(user);
  const populatedFriends = await populateFriends(user.friends);

  // Create a new outing request to send to other users
  const outingRequest = {
    outing: newOuting,
    created: new Date(Date.now()),
    read: false,
  };

  for (let u of newOuting.users) {
    if (u._id.toString() !== user._id.toString()) {
      const otherUser = await User.findById(u._id.toString());
      otherUser.outing_requests.push(outingRequest);
      await otherUser.save();
    }
  }

  // Send updated user and populated friends back
  res.send({ user, populatedFriends });
});

module.exports = router;
