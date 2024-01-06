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

// Create a new outing
router.post(
  "/:id/create-outing",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    let user = await User.findById(req.params.id);
    let outing = req.body;

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

    // Send unacceptable if outing does not have any new users
    if (
      !outing.users.find(
        (u) =>
          !user.friends.find((f) => {
            return f.toString() === u._id.toString();
          }) && u._id.toString() !== user._id.toString()
      )
    ) {
      res.status(406).send({
        header: "No daily matches added",
        message: `You need to add at least one Daily Match to the outing!`,
      });
      return;
    }

    // Add outing status and date created
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
    const activity = await Activity.findById(
      outing.activity._id || outing.activity
    );

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
  tryCatch(async (req, res) => {
    let user = await User.findById(req.params.id);
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
      user.outings = user.outings.filter((o) => o._id.toString() !== outingID);
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
router.get(
  "/:id/:outingid/join",
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
      res.status(406).send({
        header: `Cannot joing Outing`,
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
    for (usr of outing.users) {
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
      res.status(406).send({
        header: `Cannot delete Outing`,
        message: "Only Outing members can delete an Outing.",
      });
      return;
    }

    // They also cannot delete if there are more than 1 members
    if (outing.users.length > 1) {
      res.status(406).send({
        header: `Cannot delete Outing`,
        message:
          "You can only delete an Outing if there are 2 or more members.",
      });
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

    // Delete outing chat
    await Chat.deleteOne({ _id: outing.chat.toString() });

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
    let user = await User.findById(req.params.id);
    const photoString = req.body.photoString;

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
    const imageBuffer = Buffer.from(photoString.slice(23), "base64");
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
    let user = await User.findById(req.params.id);
    const photoKey = req.body.key;

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
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);
    const rating = req.body.rating;
    const activity = await Activity.findById(outing.activity);

    // Don't allow if user us not in outing members
    if (!outing.users.find((uid) => uid.toString() == user._id.toString())) {
      res.status(406).send({
        header: `Could not complete Outing`,
        message: "You are not a member of the Outing.",
      });
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

      // Add outing to activity outings
      activity.outings.push(outing);
      await activity.save();
    }
    // Else just notify all other members the outing has been marked completed
    else {
      for (u of outing.users) {
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
            userID: foundUser._id.toString(),
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
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);

    // Return unacceptable if photo is not in outing
    if (!outing.photos.find((p) => p.key == req.params.key)) {
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
