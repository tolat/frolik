const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const Chat = require("../models/chat");
const express = require("express");
const sharp = require("sharp");
const { downloadFromS3, uploadToS3, deleteFromS3 } = require("../utils/S3");
const {
  populateUser,
  populateFriends,
  sendEmail,
  getPhotosFromOutings,
  handleOutingInviteAction,
  generateUniqueName,
  pushUserUpdate,
  handleFriendRequestAction,
  findNonOutingChat,
} = require("../utils/utils");
const {
  reqAuthenticated,
  tryCatch,
  sameUserOnly,
} = require("../utils/middleware");
const { urlencoded } = require("body-parser");

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

// Upload User profile picture
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

      // Send email confirmation linkand set user status as pending
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

// Email verification route for new users
router.get(
  "/:id/verify",
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    user.status = { status: "Ready", updated: Date.now() };

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
    await user.populate("outings");
    const validStatuses = ["Ready", "Searching"];

    // Return if user already has 5+ pending outings
    if (user.outings.filter((o) => o.statu == "Pending").length > 4) {
      res.status(406).send("User has too many pending outings");
      return;
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
        !user.friends.map((f) => f._id.toString()).includes(u._id.toString()) &&
        // Don't match same user
        u._id.toString() !== user._id.toString() &&
        // No users with 5 or more pending outings
        u.outings.filter((o) => o.status == "Pending").length < 5 &&
        // No users that are alredy in the user's matches
        !user.matches.find((m) => m.user.toString() == u._id.toString())
      );
    });

    // If no full matches set, generate matches set with at most 5 matches
    if (!user.matches || !user.matches[4]) {
      const neededMatches = 5 - user.matches.length;
      // Pick 5 available users at random
      for (let i = 0; i < neededMatches; i++) {
        if (allAvailable.length > 0) {
          const index = parseInt(
            (Math.random() * 1000000) % allAvailable.length
          );
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
          matchUser.outings.filter((o) => o.status == "Pending").length > 4 ||
          // Match has become a friend
          user.friends
            .map((f) => f._id.toString())
            .includes(matchUser._id.toString())
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

    // Just send matched users back to the server
    const matches = await populateFriends(user.matches.map((m) => m.user));

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
    await chat.populate("outing.activity");

    // Populate chat users with stripped down data
    const populatedUsers = await populateFriends(
      chat.outing
        ? chat.outing.users.map((u) => u.toString())
        : chat.users.map((u) => u.toString())
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
    await user.populate("chats.outing.activity");

    // For each chat, populate the outing users with stripped data
    let chatMembersMap = {};
    for (let chat of user.chats) {
      const populatedMembers = await populateFriends(
        chat.outing
          ? chat.outing.users.map((u) => u.toString())
          : chat.users.map((u) => u.toString())
      );
      chatMembersMap[chat._id.toString()] = populatedMembers;
    }

    res.send({ chats: user.chats, chatMembersMap });
  })
);

// Create a new outing
router.post(
  "/:id/create-outing",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    let user = await User.findById(req.params.id);

    // Add outing status and date created
    let outing = req.body;
    outing.date_created = new Date(Date.now());
    outing.name = generateUniqueName();
    outing.created_by = user;
    let invited = [];
    let users = [];

    // Move all users other than request user to the outing 'invited' list
    for (let i = 0; i < outing.users.length; i++) {
      const usr = await User.findById(outing.users[i]);
      if (usr._id.toString() != user._id.toString()) {
        invited.push(usr);
      } else {
        users.push(usr);
      }
    }

    outing.users = users;
    outing.invited = invited;

    // Save and populate new Outing
    const newOuting = new Outing(outing);

    // Add a notification for all invited users
    for (u of invited) {
      const newNotification = {
        id: Date.now() + Math.random(),
        type: "outing-invite",
        outing: newOuting._id.toString(),
        created: new Date(Date.now()),
        active: true,
      };
      !u.notifications
        ? (u.notifications = [newNotification])
        : u.notifications.unshift(newNotification);
      await u.save();
    }

    // Create outing chat
    let lastRead = {}
    lastRead[user._id.toString()] = false
    const newChat = new Chat({
      outing: newOuting,
      name: newOuting.name,
      messages: [],
      touched: new Date(Date.now()),
      last_read:lastRead
    });
    await newChat.save();
    newOuting.chat = newChat._id;

    await newOuting.populate("activity");
    await newOuting.populate("users");
    await newOuting.populate("users.outings");
    await newOuting.populate("users.outings.activity");
    await newOuting.populate("invited");
    await newOuting.populate("invited.outings");
    await newOuting.populate("invited.outings.activity");

    // Save outing
    await newOuting.save();

    // Add outing to user outings and popualte user for response
    user.outings.push(newOuting);
    user.chats.push(newChat);
    await user.save();
    await populateUser(user);
    const populatedFriends = await populateFriends(user.friends);

    // Push updates to the socket
    pushUserUpdate(newOuting.invited);

    // Send updated user and populated friends back
    res.send({ user, populatedFriends, outing: newOuting });
  })
);

// Send back a populated outing
router.get(
  "/:id/outing/:outingid",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outingID = req.params.outingid;

    // send unauthorized if this outing is not related to the user
    if (
      // outing is not in user outings
      !user.outings.find((o) => o.toString() == outingID) &&
      // outing is not referenced in user notifications
      !user.notifications.find((n) => n.outing == outingID)
    ) {
      res.status(406).send("User does not have access to this outing");
      return;
    }

    const outing = await Outing.findById(outingID);
    await outing.populate("users");
    await outing.populate("activity");
    await outing.populate("users.outings");
    await outing.populate("users.outings.activity");
    await outing.populate("invited");
    await outing.populate("invited.outings");
    await outing.populate("invited.outings.activity");

    res.send({ outing });
  })
);

// Join an Outing
router.get(
  "/:id/outing/:outingid/join",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);
    const notification = user.notifications.find(
      (n) => n.outing == outing._id.toString() && n.type == "outing-invite"
    );

    // If outing does not exists send 404
    if (!user || !outing || !notification) {
      res.status(404).send("User was not invited to this outing");
      return;
    }

    // If user is not in the invited list, they cannot join. send 406
    if (!outing.invited.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send("User was not invited to this outing");
      return;
    }

    await handleOutingInviteAction(notification, user, outing, "accepted");

    res.send({ user, outing });
  })
);

// Leave an Outing
router.get(
  "/:id/outing/:outingid/leave",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);
    await outing.populate("users");

    // If outing does not exists send 404
    if (!user || !outing) {
      res.status(404).send("User was not invited to this outing");
      return;
    }

    // If user is not in the members list, they cannot leave.
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send("User was not a member of this outing");
      return;
    }

    // They also cannot leave if they are the only member
    if (outing.users.length <= 1) {
      res
        .status(406)
        .send("User is unique member and cannot leave, they must delete.");
      return;
    }

    // Add user to outing flakes and remove user form outing members
    outing.flakes.push(user);
    outing.users.splice(
      outing.users.map((u) => u._id.toString()).indexOf(user._id.toString()),
      1
    );
    await outing.save();

    // Make a new notification to send to outing members
    const newNotification = {
      id: Date.now() + Math.random(),
      type: "outing-leave",
      userID: user._id.toString(),
      outing: outing._id.toString(),
      created: new Date(Date.now()),
    };

    // Send notification to all outing users
    for (usr of outing.users) {
      const foundUsr = await User.findById(usr);
      foundUsr.notifications.push(newNotification);
      await foundUsr.save();
      pushUserUpdate([]);
    }
    pushUserUpdate([outing.users]);

    // Remove all notifications from this outing for the leaving user
    user.notifications = user.notifications.filter((n) =>
      n.outing ? n.outing != outing._id.toString() : true
    );
    await user.save();

    await populateUser(user);

    res.send({ user });
  })
);

// Delete an outing
router.get(
  "/:id/outing/:outingid/delete",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);
    await outing.populate("users");

    // If outing does not exists send 404
    if (!user || !outing) {
      res.status(404).send("User was not invited to this outing");
      return;
    }

    // If user is not in the members list, they cannot delete.
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send("User was not a member of this outing");
      return;
    }

    // They also cannot delete if there are more than 1 members
    if (outing.users.length > 1) {
      res
        .status(406)
        .send("User is not unique member and cannot delete, they must leave.");
      return;
    }

    // Clear any invites left for invited users or notifications for the deleting user
    for (u of outing.invited.concat([user._id]).concat(outing.flakes)) {
      const usr = await User.findById(u);
      const n = usr.notifications.find(
        (n) => n.outing == outing._id.toString()
      );
      if (n) {
        usr.notifications.splice(
          usr.notifications
            .map((n) => n.id.toString())
            .indexOf(n.id.toString()),
          1
        );
        await usr.save();
        pushUserUpdate([usr]);
      }
    }

    // Update all users related to the outing
    pushUserUpdate([
      user,
      ...outing.users,
      ...outing.invited,
      ...outing.flakes,
    ]);

    // Delete outing chat
    await Chat.deleteOne({ _id: outing.chat.toString() });

    // delete outing
    await Outing.deleteOne({ _id: outing._id.toString() });

    await populateUser(user);

    res.send({ user });
  })
);

// Dismiss a notification
router.post(
  "/:id/notification/:notificationid/dismiss",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const notifID = req.params.notificationid;
    const dismissStatus = req.body.status;
    const notification = user.notifications.find(
      (n) => n.id.toString() == notifID.toString()
    );
    const nIndex = user.notifications
      .map((n) => n.id.toString())
      .indexOf(notifID.toString());

    // Return if no notification exists
    if (!notification) {
      user.notifications.splice(nIndex, 1);
      await user.save();
      await populateUser(user);
      res.status(404).send("notification not found");
      return;
    }

    // Handle dismissal of different notification types
    switch (notification.type) {
      case "outing-invite":
        const outing = await Outing.findById(notification.outing);
        await handleOutingInviteAction(
          notification,
          user,
          outing,
          dismissStatus
        );
        break;

      case "friend-request":
        const requestingUser = await User.findById(notification.from);
        await handleFriendRequestAction(
          notification,
          user,
          requestingUser,
          dismissStatus
        );
        break;

      default:
        nIndex != -1 && user.notifications.splice(nIndex, 1);
        await user.save();
        await populateUser(user);
        break;
    }

    res.send({ user });
  })
);

// Send back a user with stripped down data
router.get(
  "/stripped-user/:id",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    let user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user = await populateFriends([user._id]);
    user = user[0];

    res.send({ user });
  })
);

// Upload outing photo
router.post(
  "/:id/outing/:outingid/upload-photo",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const outing = await Outing.findById(req.params.outingid);
    let user = await User.findById(req.params.id);
    const photoString = req.body.photoString;

    if (!photoString) {
      res.status(406).send("No photo received");
      return;
    }

    // Only add if outing does not already have two photos uploaded
    if (
      outing.photos.filter((p) => p.uploader.toString() == user._id.toString())
        .length > 1
    ) {
      res.status(406).send("User has already uploaded 2 photos");
      return;
    }

    // Don't allow upload if user isn't in outing users
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send("User is not a member of this outing");
      return;
    }

    // Add photo with new key to outing photos and push an update to all users
    // except the request user. They will fetch auth on request completion in client.
    const newPhotoKey = `${user._id.toString()}-${outing._id.toString()}-${Date.now()}`;
    outing.photos.push({ uploader: user, key: newPhotoKey });
    await outing.save();
    pushUserUpdate(
      outing.users.filter((u) => u.toString() != user._id.toString())
    );

    // Get user again and populate
    user = await User.findById(user._id.toString());
    await populateUser(user);

    // Resize/compress image before upload
    const imageBuffer = Buffer.from(photoString, "base64");
    const reducedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 30 })
      .withMetadata()
      .toBuffer();
    const imageString = reducedImageBuffer.toString("base64");

    // Upload image to S3
    uploadToS3(process.env.AWS_BUCKET, newPhotoKey, imageString)
      .then((response) => {
        pushUserUpdate(outing.users);
        res.send({ user });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

// delete outing photo
router.post(
  "/:id/outing/:outingid/delete-photo",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const outing = await Outing.findById(req.params.outingid);
    let user = await User.findById(req.params.id);
    const photoKey = req.body.key;

    if (!photoKey) {
      res.status(406).send("No photo key received");
      return;
    }

    // Only delete if outing has photo with key
    if (!outing.photos.find((p) => p.key == photoKey)) {
      res.status(406).send("Photo not found in Outing");
      return;
    }

    // Don't allow delete if user isn't in outing users
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send("User is not a member of this outing");
      return;
    }

    // Remove photo with key from outing photos and push an update to all users
    // except the request user. They will fetch auth on request completion in client.
    outing.photos.splice(outing.photos.map((p) => p.key).indexOf(photoKey), 1);
    await outing.save();
    pushUserUpdate(
      outing.users.filter((u) => u.toString() != user._id.toString())
    );

    // Get user again and populate
    user = await User.findById(user._id.toString());
    await populateUser(user);

    // Upload image to S3
    deleteFromS3(process.env.AWS_BUCKET, photoKey)
      .then((response) => {
        pushUserUpdate(outing.users);
        res.send({ user });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

// Add a completion to an outing
router.post(
  "/:id/outing/:outingid/add-completion",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);
    const rating = req.body.rating;
    const activity = await Activity.findById(outing.activity);

    // Don't allow if user us not in outing members
    if (!outing.users.find((uid) => uid.toString() == user._id.toString())) {
      res.status(406).send("User is not an outing member.");
      return;
    }
    outing.completions.push(user);

    // Add rating to activity ratings
    activity.ratings.push({ user, rating });
    await activity.save();

    // If this is final completion, set date_completed and notify all members
    if (outing.completions.length == outing.users.length) {
      outing.date_completed = new Date(Date.now());

      // Notify all members
      for (u of outing.users) {
        const foundUser = await User.findById(u);
        const newNotification = {
          id: Date.now() + Math.random(),
          type: "outing-complete",
          outing: outing._id.toString(),
          created: new Date(Date.now()),
          active: true,
        };
        foundUser.notifications.push(newNotification);
        await foundUser.save();
      }

      // Remove all invited
      for (u of outing.invited) {
        // Clear all notifications to do with outing
        const foundUser = await User.findById(u);
        foundUser.notifications = foundUser.notifications.filter((n) =>
          n.outing ? n.outing != outing._id.toString() : true
        );

        await foundUser.save();
      }
    }

    // push an update through socket to users other than the request user
    pushUserUpdate(
      outing.users.filter((u) =>
        u._id
          ? u._id.toString() != user._id.toString()
          : u.toString() != user._id.toString()
      )
    );

    // remove user from outing invited
    outing.invited = [];
    await outing.save();
    res.sendStatus(200);
  })
);

// Add friend
router.post(
  "/:id/add-friend",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const friendUser = await User.findById(req.body.friendID);

    // send back 406 if user has already requested this friend
    if (user.friend_requests.find((id) => id.toString() == req.body.freindID)) {
      res.status(406).send("User has already requested this friend.");
    }

    const friendRequestNotification = {
      id: Date.now() + Math.random(),
      type: "friend-request",
      from: user._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };

    friendUser.notifications.push(friendRequestNotification);
    await friendUser.save();

    user.friend_requests.push(friendUser);
    await user.save();

    pushUserUpdate([user, friendUser]);

    await populateUser(user);

    res.send({ user });
  })
);

// Remove friend
router.post(
  "/:id/remove-friend",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const friendUser = await User.findById(req.body.friendID);

    // send back 406 if user does not have this friend
    if (user.friends.find((id) => id.toString() == req.body.freindID)) {
      res.status(406).send("User has already requested this friend.");
    }

    // Remove friends
    user.friends = user.friends.filter(
      (id) => id.toString() != friendUser._id.toString()
    );
    friendUser.friends = friendUser.friends.filter(
      (id) => id.toString() != user._id.toString()
    );

    // Notify FriendUser
    const newNotification = {
      id: Date.now() + Math.random(),
      type: "friend-removed",
      by: user._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };
    friendUser.notifications.push(newNotification);

    await user.save();
    await friendUser.save();

    pushUserUpdate([user, friendUser]);

    await populateUser(user);
    const populatedFriends = await populateFriends(user.friends);

    res.send({ user, populatedFriends });
  })
);

// Create Chat
router.post(
  "/:id/chat/create",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    let withUsers = [];

    // Get users other than requesting user to be added to the chat
    for (let u of req.body.withUsers) {
      const id = u._id || u;
      const usr = await User.findById(id);

      // Check for non-existant users
      if (!usr) {
        res.status(406).send({
          message: `Trying to add a user that does not exist to chat. Invalid id: ${id}`,
        });
        return;
      }
      withUsers.push(usr);
    }

    // Check for empty withUsers
    if (withUsers.length == 0) {
      res.status(406).send({ message: "Chat must have more than one user" });
      return;
    }

    // send back 406 if user does not have this friend
    for (usr of withUsers) {
      if (!user.friends.find((id) => id.toString() == usr._id.toString())) {
        res.status(406).send({ message: "User is not friends with this user" });
        return;
      }
    }

    await user.populate("chats");
    // if chat with users found already, send back that chat
    const foundChat = findNonOutingChat(user, withUsers);
    if (foundChat) {
      res.send({ chat: foundChat });
      return;
    }

    // Create new chat if no chat exists
    
    const chat = new Chat({
      users: [user, ...withUsers],
      messages: [],
      touched: new Date(Date.now()),
      last_read: {}
    });
    let lastRead = {}
    for(usr of chat.users){
        lastRead[usr._id.toString()] = false
    }

    // Add notification for withUser
    const newNotification = {
      id: Date.now() + Math.random(),
      type: "chat-created",
      by: user._id.toString(),
      chat: chat._id.toString(),
      created: new Date(Date.now()),
      active: true,
    };

    // Save Chat
    await chat.save();

    // Save user
    user.chats.push(chat);
    await user.save();

    // Save withUsers
    for (usr of withUsers) {
      usr.chats.push(chat);
      usr.notifications.push(newNotification);
      await usr.save();
    }

    // Send push update to all involved users
    pushUserUpdate([user, ...withUsers]);

    const unpopulatedUser = await User.findById(user._id);
    chat.users = [unpopulatedUser, ...withUsers];
    res.send({ chat });
  })
);

// Update Last Read chat message
router.post(
  "/:id/chat/:chatid/update-last-read",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const chat = await Chat.findById(req.params.chatid);
    const messageID = req.body.messageID;

    if(!chat.last_read){
      chat.last_read = {}
    }
    chat.last_read[user._id.toString()] = messageID.toString();
    chat.markModified('last_read')
    await chat.save();

    pushUserUpdate([user]);

    res.sendStatus(200);
  })
);

module.exports = router;
