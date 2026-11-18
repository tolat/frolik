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
  chatForUser,
  getTotalUnreadMessages,
  outingIsPending,
  webpushNotify,
  decodeDataURL,
  toGeoPoint,
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

const { normalize: normalizeLang, tr, userLang, forUser } = require("../utils/i18n");
const router = express.Router({ mergeParams: true });

// Re-friending after an unfriend. Either side's record counts; `since` is the
// earliest rematch (after the unfriend) on either side, or null if neither
// has come up in the other's daily matches yet.
const refriendStatus = (a, b) => {
  const entry = (u, other) =>
    (u.former_friends || []).find(
      (f) => f.user && f.user.toString() === other._id.toString()
    );
  const entries = [entry(a, b), entry(b, a)].filter(Boolean);
  if (!entries.length) return { formerFriends: false, since: null };
  const rematches = entries
    .filter((f) => f.rematched && f.rematched >= f.removed)
    .map((f) => new Date(f.rematched).getTime());
  return {
    formerFriends: true,
    since: rematches.length ? new Date(Math.min(...rematches)) : null,
  };
};

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

    // The storage key is always decided server-side so a client can't
    // overwrite another user's image by sending their key.
    user.profile_picture = {
      key: user.profile_picture?.key || user.username,
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
      const imageBuffer = decodeDataURL(req.body.photoString);
      const reducedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .withMetadata()
        .toBuffer();

      // Upload image to S3
      uploadToS3(process.env.AWS_BUCKET, user.profile_picture.key, reducedImageBuffer)
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

    // Only allow known, user-editable fields. Previously every key in the
    // request body was copied onto the user document, so a client could
    // overwrite friends, username, password hash/salt, matches, etc.
    const previousLocation = user.location;
    const EDITABLE = ["first_name", "last_name", "location", "tagline"];
    for (const key of EDITABLE) {
      if (typeof profileData?.[key] === "string") user[key] = profileData[key].slice(0, 200);
    }
    // Geocoded coordinates for the location (from the location search)
    const geo = toGeoPoint(profileData?.location_geo);
    if (geo) user.location_geo = geo;
    else if (user.location !== previousLocation) user.location_geo = undefined;
    const language = normalizeLang(profileData?.language);
    if (language) user.language = language;
    const ALLOWED_STATUSES = ["Ready", "Busy", "Inactive"];
    if (ALLOWED_STATUSES.includes(profileData?.status?.status)) {
      user.status = { status: profileData.status.status, updated: Date.now() };
    }
    if (profileData?.profile_picture) {
      user.profile_picture = {
        key: user.profile_picture?.key || profileData.profile_picture.key,
        crop: profileData.profile_picture.crop,
        zoom: profileData.profile_picture.zoom,
      };
      user.markModified("profile_picture");
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
    if (typeof photoString === "string" && photoString.includes("base64")) {
      // Resize/compress image before upload
      const imageBuffer = decodeDataURL(photoString);
      const reducedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .withMetadata()
        .toBuffer();

      // Upload image to S3
      uploadToS3(
        process.env.AWS_BUCKET,
        user.profile_picture.key,
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
    const body = req.body.user || {};
    const username = String(body.username || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username) || !body.password) {
      res.status(406).send({
        header: req.t("user.invalidAccount.header"),
        message: req.t("user.invalidAccount.message"),
      });
      return;
    }
    // Whitelist fields — the raw body used to be passed straight to new User(),
    // letting a sign-up request set status, friends, matches, etc.
    const userData = {
      username,
      first_name: String(body.first_name || "").slice(0, 100),
      last_name: String(body.last_name || "").slice(0, 100),
      location: String(body.location || "").slice(0, 200),
      ...(toGeoPoint(body.location_geo) ? { location_geo: toGeoPoint(body.location_geo) } : {}),
      tagline: String(body.tagline || "").slice(0, 200),
      language: normalizeLang(body.language) || req.lang || "en",
      profile_picture: {
        key: username,
        crop: body.profile_picture?.crop,
        zoom: body.profile_picture?.zoom,
      },
    };

    // Send back error code if user already exists
    if (await User.findOne({ username: userData.username })) {
      res.status(406).send({
        header: req.t("user.exists.header", { email: userData.username }),
        message: req.t("user.exists.message"),
      });
      return;
    } else {
      // Else create new user and upload photo
      const user = new User(userData);
      await User.register(user, String(body.password));

      // Send email confirmation linkand set user status as pending
      const link = `${process.env.SERVER}/user/${user._id.toString()}/verify`;
      const lang = userLang(user);
      sendEmail(
        userData.username,
        tr(lang, "email.verify.subject"),
        genVerifyAccountEmail(lang, link)
      );
      if (process.env.NODE_ENV == "development")
        console.log("[dev] verification link:", link);
      user.status = { status: "Pending", updated: Date.now() };
      await user.save();

      // Convert to buffer and adjust quality before uploading
      const imageBuffer = decodeDataURL(req.body.photoString);
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
    const user = await User.findById(req.params.id);

    // If user not found, send unacceptable (406)
    if (!user) {
      res.status(406).send({
        header: req.t("auth.userNotFound.header"),
        message: req.t("auth.userNotFound.message"),
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
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    await user.populate("outings");
    const MATCH_TTL = 24 * 60 * 60 * 1000;
    const MAX_MATCHES = 5;
    const userID = user._id.toString();
    const friendIDs = user.friends.map((f) => (f._id || f).toString());
    const pendingCount = (u) =>
      u.outings.filter((o) => o && outingIsPending(u, o)).length;

    // Users with 5+ pending outings can't create more, so no new matches
    if (pendingCount(user) >= 5) {
      const matches = await populateFriends(user.matches.map((m) => m.user));
      return res.send({ matches });
    }

    // Candidates: Ready users nearby (same city label, or within 50 km when
    // locations are geocoded) who aren't friends, aren't the user, and don't
    // have 5+ pending outings themselves
    const MATCH_RADIUS_KM = 50;
    const nearby = [{ location: user.location }];
    if (user.location_geo?.coordinates?.length === 2) {
      nearby.push({
        location_geo: {
          $geoWithin: {
            $centerSphere: [user.location_geo.coordinates, MATCH_RADIUS_KM / 6378.1],
          },
        },
      });
    }
    let allAvailable = await User.find({
      "status.status": "Ready",
      $or: nearby,
      _id: { $ne: user._id, $nin: user.friends },
    }).populate("outings");
    allAvailable = allAvailable.filter((u) => pendingCount(u) < 5);
    const availableByID = new Map(allAvailable.map((u) => [u._id.toString(), u]));

    // Keep only matches that are still valid (< 24h old, still available)
    const kept = user.matches.filter(
      (m) =>
        m.user &&
        Date.now() - new Date(m.updated).getTime() < MATCH_TTL &&
        !friendIDs.includes(m.user.toString()) &&
        availableByID.has(m.user.toString())
    );
    const keptIDs = new Set(kept.map((m) => m.user.toString()));

    // Top up to MAX_MATCHES with random available users
    const pool = allAvailable.filter((u) => !keptIDs.has(u._id.toString()));
    while (kept.length < MAX_MATCHES && pool.length > 0) {
      const [picked] = pool.splice(Math.floor(Math.random() * pool.length), 1);
      kept.push({ user: picked._id, updated: Date.now() });
    }

    // A former friend showing up in the matches is the first step to being
    // friends again (see /add-friend): stamp when it happened
    const keptSet = new Set(kept.map((m) => m.user.toString()));
    let formerChanged = false;
    for (const f of user.former_friends || []) {
      if (
        f.user &&
        keptSet.has(f.user.toString()) &&
        !(f.rematched && f.rematched >= f.removed)
      ) {
        f.rematched = new Date();
        formerChanged = true;
      }
    }

    // Write only these fields: a whole-document save() here raced the
    // location update that runs at the same moment on login (VersionError)
    user.matches = kept;
    const changes = { matches: kept };
    if (formerChanged) changes.former_friends = user.former_friends;
    await User.updateOne({ _id: user._id }, { $set: changes });

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

    res.send({ chat: chatForUser(user, chat), populatedUsers });
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

    res.send({
      chats: user.chats.map((c) => chatForUser(user, c)),
      chatMembersMap,
    });
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

    if (!friendUser || friendUser._id.toString() === user._id.toString()) {
      return res.status(406).send({ header: req.t("common.userNotFound.header"), message: "" });
    }

    if (user.friends.some((id) => id.toString() === friendUser._id.toString())) {
      return res.status(406).send({
        header: req.t("friend.alreadyFriends.header"),
        message: req.t("friend.alreadyFriends.message", { name: friendUser.first_name }),
      });
    }

    // Friends can only be added after completing an Outing together that came
    // from a daily match between the two of you: one of you created it (an
    // Outing's invitees are always the creator's matches or friends). Someone
    // you only met through a third person's match, or saw on Social, can't be
    // added. Flaking removes a user from outing.users, so being in a
    // completed outing's users means they saw it through.
    const pairOuting = (extra = {}) =>
      Outing.exists({
        users: { $all: [user._id, friendUser._id] },
        // Outings from before created_by was recorded count (legacy)
        $or: [
          { created_by: { $in: [user._id, friendUser._id] } },
          { created_by: { $exists: false } },
          { created_by: null },
        ],
        date_completed: { $exists: true, $ne: null },
        ...extra,
      });
    if (!(await pairOuting())) {
      return res.status(406).send({
        header: req.t("friend.completeOutingFirst.header"),
        message: req.t("friend.completeOutingFirst.message", { name: friendUser.first_name }),
      });
    }

    // Unfriended before: they must come up in daily matches again, then
    // complete a new Outing together (created after the rematch)
    const refriend = refriendStatus(user, friendUser);
    if (refriend.formerFriends) {
      const newOuting =
        refriend.since &&
        (await pairOuting({ date_created: { $gte: refriend.since } }));
      if (!newOuting) {
        return res.status(406).send({
          header: req.t("friend.notYet.header"),
          message: req.t("friend.notYet.message", { name: friendUser.first_name }),
        });
      }
    }

    // send back 406 if user has already requested this friend
    if (user.friend_requests.find((id) => id.toString() == req.body.friendID)) {
      res.status(406).send({
        header: req.t("friend.requestAlreadySent.header"),
        message: req.t("friend.requestAlreadySent.message", {
          name: `${friendUser.first_name} ${friendUser.last_name}`,
        }),
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
      title: forUser("push.friendRequest.title"),
      body: forUser("push.friendRequest.body", {
        name: `${user.first_name} ${user.last_name}`,
      }),
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
    if (!user.friends.find((id) => id.toString() == req.body.friendID)) {
      res.status(406).send({
        header: req.t("friend.cannotRemove.header"),
        message: req.t("friend.cannotRemove.message", {
          name: `${friendUser.first_name} ${friendUser.last_name}`,
        }),
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

    // Remember the unfriending on both sides (see /add-friend)
    const markFormer = (u, otherID) => {
      u.former_friends = (u.former_friends || []).filter(
        (f) => f.user && f.user.toString() !== otherID.toString()
      );
      u.former_friends.push({ user: otherID, removed: new Date() });
    };
    markFormer(user, friendUser._id);
    markFormer(friendUser, user._id);

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
          header: req.t("chat.userMissing.header"),
          message: req.t("chat.userMissing.message"),
        });
        return;
      }
      withUsers.push(usr);
    }

    // Check for empty withUsers
    if (withUsers.length == 0) {
      res.status(406).send({
        header: req.t("chat.tooFewMembers.header"),
        message: req.t("chat.tooFewMembers.message"),
      });
      return;
    }

    // send back 406 if user does not have this friend
    for (const usr of withUsers) {
      if (!user.friends.find((id) => id.toString() == usr._id.toString())) {
        res.status(406).send({
          header: req.t("chat.notFriends.header"),
          message: req.t("chat.notFriends.message", {
            name: `${usr.first_name} ${usr.last_name}`,
          }),
        });
        return;
      }
    }

    await user.populate("chats");
    // if chat with users found already, send back that chat
    const foundChat = findNonOutingChat(user, withUsers);
    if (foundChat) {
      res.send({ chat: chatForUser(user, foundChat) });
      return;
    }

    // A chat with exactly these people that this user deleted "for me": bring
    // it back for them (old messages stay hidden) instead of starting a
    // second chat the others would see twice
    const memberIDs = [user._id, ...withUsers.map((u) => u._id)];
    const deletedChat = await Chat.findOne({
      outing: null, // matches missing too
      users: { $all: memberIDs, $size: memberIDs.length },
    });
    if (deletedChat) {
      await User.updateOne({ _id: user._id }, { $addToSet: { chats: deletedChat._id } });
      res.send({ chat: chatForUser(user, deletedChat) });
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
    for (const usr of chat.users) {
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
    for (const usr of withUsers) {
      usr.chats.push(chat);
      usr.notifications.push(newNotification);
      await usr.save();
    }

    // Send push update to all involved users
    pushUserUpdate([user, ...withUsers]);

    // Send a webpush Notification to involved users as well
    webpushNotify(withUsers, {
      title: forUser("push.chatCreated.title"),
      body: forUser("push.chatCreated.body", {
        name: `${user.first_name} ${user.last_name}`,
      }),
      url: `/chat?open=${chat._id.toString()}`,
    });

    const unpopulatedUser = await User.findById(user._id);
    chat.users = [unpopulatedUser, ...withUsers];
    res.send({ chat });
  })
);

// Delete a non-outing chat for the requesting user.
// Removes the chat from their chats array; if no users remain, deletes the document.
router.post(
  "/:id/chat/:chatid/delete",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const chat = await Chat.findById(req.params.chatid);

    if (!chat) {
      return res.status(404).send({ header: req.t("chat.notFound.header"), message: "" });
    }

    // Outing chats are owned by the outing — delete the outing to remove the chat
    if (chat.outing) {
      return res.status(406).send({
        header: req.t("chat.cannotDeleteOutingChat.header"),
        message: req.t("chat.cannotDeleteOutingChat.message"),
      });
    }

    // Verify the requesting user is actually in the chat
    if (!chat.users.find((u) => u.toString() === user._id.toString())) {
      return res.status(401).send("Not authorized");
    }

    // "Delete for me": the chat leaves this user's list and its earlier
    // messages are hidden for them; the other members keep it unchanged
    // (they used to see this person drop out of the chat). A later message
    // brings it back for this user.
    const now = new Date();
    user.chats = user.chats.filter((c) => c.toString() !== chat._id.toString());
    user.cleared_chats = (user.cleared_chats || []).filter(
      (c) => c.chat && c.chat.toString() !== chat._id.toString()
    );
    user.cleared_chats.push({ chat: chat._id, at: now });
    await user.save();

    // Nothing left unread for them in it
    const latest = chat.messages?.[0];
    if (latest) {
      if (!chat.last_read) chat.last_read = {};
      chat.last_read[user._id.toString()] = latest.id;
      chat.markModified("last_read");
      await chat.save();
    }

    // Everyone has deleted it: remove the chat itself
    const stillListed = await User.exists({ _id: { $in: chat.users }, chats: chat._id });
    if (!stillListed) {
      await Chat.deleteOne({ _id: chat._id });
      await User.updateMany(
        { _id: { $in: chat.users } },
        { $pull: { cleared_chats: { chat: chat._id } } }
      );
    }

    res.sendStatus(200);
  })
);

// Archive / unarchive an Outing chat for the requesting user
router.post(
  "/:id/chat/:chatid/archive",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const chatID = req.params.chatid;

    if (!user.chats.some((c) => c.toString() === chatID)) {
      return res.status(401).send("Not authorized");
    }

    const update = req.body.archived
      ? { $addToSet: { archived_chats: chatID } }
      : { $pull: { archived_chats: chatID } };
    const updated = await User.findByIdAndUpdate(user._id, update, { new: true });

    res.send({ archived_chats: updated.archived_chats });
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

// Update just the location (and/or the "keep my location up to date"
// setting) without a full profile save. Used by the Settings switch and the
// automatic update on app open.
router.post(
  "/:id/location",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const { location, location_geo, auto_location } = req.body;

    const changes = {};
    if (typeof auto_location === "boolean") {
      user.auto_location = changes.auto_location = auto_location;
    }

    if (location !== undefined) {
      const geo = toGeoPoint(location_geo);
      if (typeof location !== "string" || !location.trim() || !geo) {
        return res.status(406).send({
          header: req.t("user.invalidLocation.header"),
          message: req.t("user.invalidLocation.message"),
        });
      }
      user.location = changes.location = location.slice(0, 200);
      user.location_geo = changes.location_geo = geo;
    }

    // Only these fields (see /matches: concurrent whole-document saves fail)
    if (Object.keys(changes).length) {
      await User.updateOne({ _id: user._id }, { $set: changes });
    }
    pushUserUpdate(user.friends);
    res.send({
      location: user.location,
      location_geo: user.location_geo,
      auto_location: user.auto_location,
    });
  })
);

// Mark the in-app tour as seen so it doesn't auto-start on the next login
router.post(
  "/:id/tour-seen",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    req.user.tour_seen = true;
    await req.user.save();
    res.sendStatus(200);
  })
);

// Set 'Like' value for a user and an outing (idempotent: liking twice
// can't add duplicate likes, unliking when not liked is a no-op)
router.post(
  "/:id/set-like",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const update = req.body.liked
      ? { $addToSet: { likes: user._id } }
      : { $pull: { likes: user._id } };
    const outing = await Outing.findByIdAndUpdate(req.body.outingID, update, {
      new: true,
    });

    if (!outing) {
      return res.status(404).send({ header: req.t("outing.notFound.header"), message: "" });
    }

    pushUserUpdate([...outing.users, user]);

    res.send({ outing });
  })
);

module.exports = router;
