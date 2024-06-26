const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const Chat = require("../models/chat");
const express = require("express");
const sharp = require("sharp");
const {
  downloadFromS3,
  uploadToS3,
  deleteFromS3,
  getSignedURLFromS3,
} = require("../utils/S3");
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
  getTotalUnreadMessages,
  outingIsPending,
  webpushNotify,
} = require("../utils/utils");
const {
  reqAuthenticated,
  tryCatch,
  sameUserOnly,
} = require("../utils/middleware");
const {
  genVerifyAccountEmail,
  genOutingInviteEmail,
} = require("../utils/emailTemplates");

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

    getSignedURLFromS3(process.env.AWS_BUCKET, req.params.key)
      .then((url) => {
        res.send(url);
      })
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
    getSignedURLFromS3(process.env.AWS_BUCKET, user.profile_picture.key)
      .then((url) => res.send(url))
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
      const imageBuffer = Buffer.from(req.body.photoString.slice(23), "base64");
      const reducedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .withMetadata()
        .toBuffer();

      // Upload image to S3
      uploadToS3(process.env.AWS_BUCKET, req.body.key, reducedImageBuffer)
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

    // Push update to all user friends
    pushUserUpdate(user.friends);

    // Only upload image if it is not the same as the current
    // (will be a base64 string for new uploads)
    if (photoString.includes("base64")) {
      // Resize/compress image before upload
      const imageBuffer = Buffer.from(photoString.slice(23), "base64");
      const reducedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .withMetadata()
        .toBuffer();

      // Upload image to S3
      uploadToS3(
        process.env.AWS_BUCKET,
        profileData.profile_picture.key,
        reducedImageBuffer
      )
        .then(() => {
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

// Create a new user
router.post(
  "/create",
  tryCatch(async (req, res) => {
    let userData = { ...req.body.user };
    userData.username = userData.username.toLowerCase();

    // Send back error code if user already exists
    if (await User.findOne({ username: userData.username })) {
      res.status(406).send({
        header: `User ${userData.username} already exists`,
        message: "Try another username.",
      });
      return;
    } else {
      // Else create new user and upload photo
      const user = new User(userData);
      await User.register(user, userData.password);

      // Send email confirmation linkand set user status as pending
      const link = `${process.env.SERVER}/user/${user._id.toString()}/verify`;
      sendEmail(
        userData.username,
        "Verify frolik.ca Email",
        genVerifyAccountEmail(link)
      );
      user.status = { status: "Pending", updated: Date.now() };
      await user.save();

      // Convert to buffer and adjust quality before uploading
      const imageBuffer = Buffer.from(req.body.photoString.slice(23), "base64");
      const reducedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 30 })
        .withMetadata()
        .toBuffer();

      // Upload image to S3
      uploadToS3(
        process.env.AWS_BUCKET,
        user.profile_picture.key,
        reducedImageBuffer
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
    console.log("HERE");
    const user = await User.findById(req.params.id);

    // If user not found, send unacceptable (406)
    if (!user) {
      res.status(406).send({
        header: "User Not Found",
        message: `We can't find a user with the username you provided!`,
      });
      return;
    }

    user.status = { status: "Ready", updated: Date.now() };
    await user.save();

    res.redirect("/email-verified");
  })
);

// Gets/updates the daily matched users for a user
router.get(
  "/:id/matches",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    await user.populate("outings");

    // Return if user already has 5+ pending outings
    if (user.outings.filter((o) => o.status == "Pending").length > 4) {
      res.status(200);
      return;
    }

    // Limit matches to users who have status ready
    let allAvailable = await User.find({
      $and: [{ "status.status": "Ready" }, { location: user.location }],
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

    // Replace or delete any invalid matches
    for (match of user.matches) {
      const matchUser = await User.findById(match.user);
      await matchUser.populate("outings");
      if (
        // Match is 24 hrs old or more
        Date.now() - new Date(match.updated).getTime() > 86400000 ||
        // Match status has changed to Busy or Incative
        matchUser.status.status != "Ready" ||
        // Match has 5 or more pending outings
        matchUser.outings.filter((o) => o.status == "Pending").length > 4 ||
        // Match has become a friend
        user.friends
          .map((f) => (f._id ? f._id.toString() : f.toString()))
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

    // Make sure user has 5 matches if possible
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

// Get populated chats for a user
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
      res.status(406).send({
        header: `Friend request already sent`,
        message: `You have already asked ${friendUser.first_name} ${friendUser.last_name} to be your friend.`,
      });
      return;
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

    // Send a webpush Notification to other users as well
    webpushNotify([friendUser], {
      title: "Friend Request",
      body: `${user.first_name} ${user.last_name} is asking to be your friend!`,
    });

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
      res.status(406).send({
        header: `Could not remove friend`,
        message: `You are not friends with ${friendUser.first_name} ${friendUser.last_name}`,
      });
      return;
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
          header: `Could not add user to chat`,
          message: `User does not exist, or has been deleted.`,
        });
        return;
      }
      withUsers.push(usr);
    }

    // Check for empty withUsers
    if (withUsers.length == 0) {
      res.status(406).send({
        header: `Could not create chat`,
        message: `Chats must have more than one member.`,
      });
      return;
    }

    // send back 406 if user does not have this friend
    for (usr of withUsers) {
      if (!user.friends.find((id) => id.toString() == usr._id.toString())) {
        res.status(406).send({
          header: `Could not add friend to chat`,
          message: `You are not friends with ${usr.first_name} ${usr.last_name}`,
        });
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
      last_read: {},
    });
    let lastRead = {};
    for (usr of chat.users) {
      lastRead[usr._id.toString()] = "initialized";
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

    // Send a webpush Notification to involved users as well
    webpushNotify([user, ...withUsers], {
      title: "Chat Created",
      body: `${user.first_name} ${user.last_name} added you to a chat`,
    });

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

    if (!chat.last_read) {
      chat.last_read = {};
    }

    chat.last_read[user._id.toString()] = messageID?.toString();
    chat.markModified("last_read");
    await chat.save();

    pushUserUpdate([user]);

    res.sendStatus(200);
  })
);

// Get Feed Outings
router.get(
  "/:id/feed-outings",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    // Populate user friends to get their outings
    await user.populate("friends");
    await user.populate("friends.outings");
    await user.populate("friends.outings.activity");
    await user.populate("friends.outings.users");
    await user.populate("friends.outings.users.outings");
    await user.populate("friends.outings.users.outings.activity");

    let outings = {};
    const sampleUser = await User.findOne({ username: "app.frolik@gmail.com" });
    for (let usr of user.friends) {
      // Don't show other users the sample user content
      for (let outing of usr.outings) {
        if (
          outing.date_completed &&
          !outings[outing._id.toString()] &&
          !outing.users.find(
            (u) => u._id.toString() == sampleUser?._id.toString()
          )
        ) {
          outings[outing._id.toString()] = outing;
        }
      }
    }

    res.send({ outings });
  })
);

// Set 'Like' value for a user and an outing
router.post(
  "/:id/set-like",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.body.outingID);

    req.body.liked
      ? outing.likes.push(user._id)
      : (outing.likes = outing.likes
          .map((id) => id.toString())
          .filter((idString) => idString !== user._id.toString()));

    await outing.save();
    pushUserUpdate([...outing.users, user]);

    res.send({ outing });
  })
);

module.exports = router;
