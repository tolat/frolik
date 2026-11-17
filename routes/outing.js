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
  decodeDataURL,
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

const { finalizeOuting } = require("../utils/outingLifecycle");

const router = express.Router({ mergeParams: true });

// Create a new outing
router.post(
  "/:id/create-outing",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    let user = req.user;
    let outing = req.body;
    const userID = user._id.toString();

    // Normalize + de-duplicate the requested member ids
    const requestedIDs = [
      ...new Set(
        (Array.isArray(outing.users) ? outing.users : [])
          .map((u) => (u?._id || u)?.toString())
          .filter(Boolean)
      ),
    ];
    const inviteeIDs = requestedIDs.filter((id) => id !== userID);

    // Send unacceptable if user has 5 pending outings already
    await user.populate("outings");
    if (user.outings.filter((o) => outingIsPending(user, o)).length > 4) {
      res.status(406).send({
        header: "Too Many Pending Outings",
        message: `You can only have up to 5 pending outings at a time. Either complete, leave, 
        or delete an outing before creating another one.`,
      });
      return;
    }

    // Every outing must include at least one of the user's current Daily
    // Matches (a non-friend). Previously any non-friend id was accepted, so
    // the rule could be bypassed by inviting an arbitrary user.
    const friendIDs = new Set(user.friends.map((f) => f.toString()));
    const matchIDs = new Set(
      (user.matches || []).map((m) => m.user?.toString()).filter(Boolean)
    );
    const hasDailyMatch = inviteeIDs.some(
      (id) => matchIDs.has(id) && !friendIDs.has(id)
    );
    if (!hasDailyMatch) {
      res.status(406).send({
        header: "Add a Daily Match",
        message: `Every Outing needs at least one of today's Daily Matches — someone new! Add a match from the Daily Matches list and try again.`,
      });
      return;
    }

    // Invitees may only be friends or daily matches
    const strangers = inviteeIDs.filter(
      (id) => !friendIDs.has(id) && !matchIDs.has(id)
    );
    if (strangers.length) {
      res.status(406).send({
        header: "Can't invite that user",
        message: "You can only invite friends and your Daily Matches.",
      });
      return;
    }

    // At most one friend per Daily Match, so every Outing is at least half
    // new people
    const friendCount = inviteeIDs.filter((id) => friendIDs.has(id)).length;
    const newMatchCount = inviteeIDs.filter(
      (id) => matchIDs.has(id) && !friendIDs.has(id)
    ).length;
    if (friendCount > newMatchCount) {
      const needed = friendCount - newMatchCount;
      res.status(406).send({
        header: "Balance your Outing",
        message: `You can invite one friend for each Daily Match. Add ${needed} more Daily Match${
          needed > 1 ? "es" : ""
        } or remove ${needed} friend${needed > 1 ? "s" : ""}.`,
      });
      return;
    }

    const activity = await Activity.findById(
      outing.activity?._id || outing.activity
    );
    if (!activity) {
      res.status(406).send({
        header: "Activity not found",
        message: "Pick an activity for your Outing and try again.",
      });
      return;
    }
    const inviteeUsers = (await User.find({ _id: { $in: inviteeIDs } }));

    // Add outing status and date created
    // Build the outing from validated fields only (not the raw request body)
    const invited = inviteeUsers;

    // Optional name from the creator (max 20 chars), else a random one
    const OUTING_NAME_MAX = 20;
    const requestedName =
      typeof outing.name === "string"
        ? outing.name.replace(/[\u0000-\u001f\u007f]/g, "").trim()
        : "";
    if (requestedName.length > OUTING_NAME_MAX) {
      res.status(406).send({
        header: "Could not create outing",
        message: `Outing names can be at most ${OUTING_NAME_MAX} characters.`,
      });
      return;
    }
    const newOuting = new Outing({
      activity: activity._id,
      date_created: new Date(),
      name: requestedName || generateUniqueName(),
      created_by: user._id,
      users: [user._id],
      invited: invited.map((u) => u._id),
    });
    outing = newOuting;

    // Add a notification for all invited users
    for (const u of invited) {
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

      // Send notification email to user
      await u.populate({
        path: "chats",
        populate: {
          path: "outing",
        },
      });
      const userUnreadMessages = getTotalUnreadMessages(u);
      sendEmail(
        u.username,
        "Outing Invitation",
        genOutingInviteEmail(
          user,
          outing,
          u.notifications.length,
          userUnreadMessages
        )
      );
    }

    // Create outing chat
    let lastRead = {};
    lastRead[user._id.toString()] = "initialized";
    const newChat = new Chat({
      outing: newOuting,
      name: newOuting.name,
      messages: [],
      touched: new Date(Date.now()),
      last_read: lastRead,
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

    // Send webpush Notification to invited users
    webpushNotify(newOuting.invited, {
      title: "Outing Invite",
      body: `${user.first_name} ${user.last_name} has invited you on an Outing!`,
    });

    // Send updated user and populated friends back
    res.send({ user, populatedFriends, outing: newOuting });
  })
);

// Send back a populated outing
router.get(
  "/:id/:outingid",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    let user = req.user;
    const outingID = req.params.outingid;

    // send unauthorized if this outing is not related to the user
    if (
      // outing is not in user outings
      !user.outings.find((o) => o.toString() == outingID) &&
      // outing is not referenced in user notifications
      !user.notifications.find((n) => n.outing == outingID)
    ) {
      res.status(406).send({
        header: `User does not have access to Outing ${outingID}`,
        message: "",
      });
      return;
    }

    const outing = await Outing.findById(outingID);

    if (!outing) {
      // Clean up dangling references to a deleted outing
      user.outings = user.outings.filter((o) => o._id.toString() !== outingID);
      user.notifications = user.notifications.filter((n) => n.outing != outingID);
      await user.save();
      res.sendStatus(200);
    } else {
      await outing.populate("users");
      await outing.populate("activity");
      await outing.populate("users.outings");
      await outing.populate("users.outings.activity");
      await outing.populate("invited");
      await outing.populate("invited.outings");
      await outing.populate("invited.outings.activity");

      res.send({ outing });
    }
  })
);

// Join an Outing
// Rename an outing (any member). Keeps the outing chat's name in step.
router.post(
  "/:id/:outingid/rename",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const OUTING_NAME_MAX = 20;
    const user = req.user;
    const name =
      typeof req.body.name === "string"
        ? req.body.name.replace(/[\u0000-\u001f\u007f]/g, "").trim()
        : "";
    if (!name || name.length > OUTING_NAME_MAX) {
      res.status(406).send({
        header: "Could not rename outing",
        message: `Outing names must be 1-${OUTING_NAME_MAX} characters.`,
      });
      return;
    }

    const outing = await Outing.findById(req.params.outingid);
    if (!outing) return res.status(404).send("Outing not found");
    if (!outing.users.some((u) => u.toString() === user._id.toString())) {
      res.status(406).send({
        header: "Could not rename outing",
        message: "Only members of the Outing can rename it.",
      });
      return;
    }

    outing.name = name;
    await outing.save();
    if (outing.chat) await Chat.findByIdAndUpdate(outing.chat, { name });

    pushUserUpdate([...outing.users, ...outing.invited]);

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

router.get(
  "/:id/:outingid/join",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const outing = await Outing.findById(req.params.outingid);
    const notification =
      outing &&
      user.notifications.find(
        (n) => n.outing == outing._id.toString() && n.type == "outing-invite"
      );

    // If outing does not exists send 404
    if (!user || !outing || !notification) {
      res.status(404).send("User was not invited to this outing");
      return;
    }

    // If user is not in the invited list, they cannot join. send 406
    if (!outing.invited.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Cannot join Outing`,
        message: "User was not invited to this Outing.",
      });
      return;
    }

    // Send unacceptable if user has 5 pending outings already
    await user.populate("outings");
    if (user.outings.filter((o) => outingIsPending(user, o)).length > 4) {
      res.status(406).send({
        header: "Too Many Pending Outings",
        message: `You can only have up to 5 pending outings at a time. Either complete, leave, 
        or delete an outing before creating another one.`,
      });
      return;
    }

    await handleOutingInviteAction(notification, user, outing, "accepted");

    res.send({ user, outing });
  })
);

// Leave an Outing
router.get(
  "/:id/:outingid/leave",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const outing = await Outing.findById(req.params.outingid);

    // If outing does not exists send 404
    if (!user || !outing) {
      res.status(404).send("User was not invited to this outing");
      return;
    }
    await outing.populate("users");

    // If user is not in the members list, they cannot leave.
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Cannot leave Outing`,
        message: "You must be in the Outing members list to leave the Outing.",
      });
      return;
    }

    // They also cannot leave if they are the only member
    if (outing.users.length <= 1) {
      res.status(406).send({
        header: `Cannot leave Outing.`,
        message: "You are the only member - you can only delete this Outing.",
      });
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
    for (const usr of outing.users) {
      const foundUsr = await User.findById(usr);
      foundUsr.notifications.push(newNotification);
      await foundUsr.save();
    }
    pushUserUpdate([user, ...outing.users]);

    // Send webpush Notification to all outing members
    webpushNotify(outing.users, {
      title: "Outing Left",
      body: `${user.first_name} ${user.last_name} has left the Outing: ${outing.name}`,
    });

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
  "/:id/:outingid/delete",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const outing = await Outing.findById(req.params.outingid);

    // If outing does not exist send 404 (must check before populate)
    if (!user || !outing) {
      res.status(404).send("User or outing not found");
      return;
    }

    await outing.populate("users");

    // If user is not in the members list, they cannot delete.
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Cannot delete Outing`,
        message: "Only Outing members can delete an Outing.",
      });
      return;
    }

    // They also cannot delete if there are still other members
    if (outing.users.length > 1) {
      res.status(406).send({
        header: `Cannot delete Outing`,
        message: "You can only delete an Outing when you are the only remaining member.",
      });
      return;
    }

    // Clear any invites left for invited users or notifications for the deleting user
    for (const u of outing.invited.concat([user._id]).concat(outing.flakes)) {
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

    // Send webpush Notification to related users
    webpushNotify(
      [
        ...outing.users.filter((u) => u._id.toString() !== user._id.toString()),
        ...outing.invited,
        ...outing.flakes,
      ],
      {
        title: "Outing Deleted",
        body: `${user.first_name} ${user.last_name} has deleted the Outing "${outing.name}"`,
      }
    );

    // Delete outing chat and remove it from members' chat lists
    if (outing.chat) {
      await Chat.deleteOne({ _id: outing.chat });
      await User.updateMany(
        { chats: outing.chat },
        { $pull: { chats: outing.chat } }
      );
    }
    await User.updateMany(
      { outings: outing._id },
      { $pull: { outings: outing._id } }
    );
    await Activity.updateOne(
      { _id: outing.activity },
      { $pull: { outings: outing._id } }
    );

    // Remove outing photos from storage
    for (const p of outing.photos || []) {
      deleteFromS3(process.env.AWS_BUCKET, p.key).catch((e) =>
        console.error("Error deleting outing photo:", e.message)
      );
    }

    // delete outing
    await Outing.deleteOne({ _id: outing._id.toString() });

    await populateUser(user);

    res.send({ user });
  })
);

// Upload outing photo
router.post(
  "/:id/:outingid/upload-photo",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const outing = await Outing.findById(req.params.outingid);
    let user = req.user;
    const photoString = req.body.photoString;
    if (!outing) return res.status(404).send("Outing not found");

    if (!photoString) {
      res.status(406).send({
        header: `Could not upload photo`,
        message: "No photo was received.",
      });
      return;
    }

    // Only add if outing does not already have two photos uploaded
    if (
      outing.photos.filter((p) => p.uploader.toString() == user._id.toString())
        .length > 1
    ) {
      res.status(406).send({
        header: `Too many photos`,
        message: "You can only upload maximum 2 photos per user per Outing.",
      });
      return;
    }

    // Don't allow upload if user isn't in outing users
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Could not upload photo`,
        message: "You are not a member of the Outing.",
      });
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
    const imageBuffer = decodeDataURL(photoString);
    const reducedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 30 })
      .withMetadata()
      .toBuffer();

    // Upload image to S3
    uploadToS3(process.env.AWS_BUCKET, newPhotoKey, reducedImageBuffer)
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

// Delete outing photo
router.post(
  "/:id/:outingid/delete-photo",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const outing = await Outing.findById(req.params.outingid);
    let user = req.user;
    const photoKey = req.body.key;
    if (!outing) return res.status(404).send("Outing not found");

    if (!photoKey) {
      res.status(406).send({
        header: `Could not delete photo`,
        message: "No deletion key received.",
      });
      return;
    }

    // Only delete if outing has photo with key
    if (!outing.photos.find((p) => p.key == photoKey)) {
      res.status(406).send({
        header: `Could not delet photo`,
        message: `Could not find photo ${photoKey} in Outing photos.`,
      });
      return;
    }

    // Don't allow delete if user isn't in outing users
    if (!outing.users.find((u) => u._id.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Could not delete photo`,
        message: "You are not a member of the Outing.",
      });
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
  "/:id/:outingid/add-completion",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const outing = await Outing.findById(req.params.outingid);
    if (!outing) {
      res.status(404).send("Outing not found");
      return;
    }
    const rating = Math.max(0, Math.min(5, Number(req.body.rating) || 0));
    const activity = await Activity.findById(outing.activity);

    // Don't allow completing twice (used to duplicate completions/ratings and
    // could mark the outing finished before everyone had completed it)
    if (outing.completions.some((c) => c.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Already completed`,
        message: "You've already marked this Outing complete.",
      });
      return;
    }

    // Don't allow if user us not in outing members
    if (!outing.users.find((uid) => uid.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Could not complete Outing`,
        message: "You are not a member of the Outing.",
      });
      return;
    }
    outing.completions.push(user);

    // Add rating to activity ratings (replace any earlier rating by this user)
    if (activity) {
      activity.ratings = activity.ratings.filter(
        (r) => r.user?.toString() !== user._id.toString()
      );
      activity.ratings.push({ user: user._id, rating });
      await activity.save();
    }

    // The first completion starts the 30-day clock for everyone else
    if (!outing.completion_started) outing.completion_started = new Date();

    // If this is final completion, finish the outing (shared with the
    // stale-outing job) — notifies members, clears invites, records it on
    // the activity
    if (outing.completions.length == outing.users.length) {
      await finalizeOuting(outing, activity);
    }
    // Else just notify all other members the outing has been marked completed
    if (!outing.date_completed) {
      for (const u of outing.users) {
        const foundUser = await User.findById(u);

        // Don't notify users who have already marked outing complete
        if (
          outing.completions.find((comp) => {
            return comp._id
              ? comp._id.toString() === foundUser._id.toString()
              : comp.toString() === foundUser._id.toString();
          })
        )
          continue;

        if (foundUser._id.toString() !== user._id.toString()) {
          const newNotification = {
            id: Date.now() + Math.random(),
            type: "outing-marked-complete",
            userID: user._id.toString(),
            outing: outing._id.toString(),
            created: new Date(Date.now()),
            active: true,
          };

          foundUser.notifications.push(newNotification);
          await foundUser.save();
        }
      }
    }

    // push an update through socket to users other than the request user
    const otherUsers = outing.users.filter((u) =>
      u._id
        ? u._id.toString() != user._id.toString()
        : u.toString() != user._id.toString()
    );
    pushUserUpdate(otherUsers);

    // Send a webpush Notification to other users as well
    webpushNotify(otherUsers, {
      title: "Outing Marked Complete",
      body: `${user.first_name} ${user.last_name} marked the Outing "${outing.name}" completed`,
    });

    // remove user from outing invited
    outing.invited = [];
    await outing.save();
    res.sendStatus(200);
  })
);

// Get a photo from an outing with given key
router.get(
  "/:outingid/photo/:key",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const outing = await Outing.findById(req.params.outingid);

    // Return unacceptable if photo is not in outing
    if (!outing || !outing.photos.find((p) => p.key == req.params.key)) {
      res.status(406).send({
        message: `photo with key ${
          req.params.key
        } not found in outing ${outing._id.toString()}`,
      });
      return;
    }

    // Download image stream from S3 and pipe into response
    getSignedURLFromS3(process.env.AWS_BUCKET, req.params.key)
      .then((url) => res.send(url))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

module.exports = router;
