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
const { pushUserUpdate, decodeDataURL } = require("../utils/utils");
const { getSignedURLFromS3, uploadToS3 } = require("../utils/S3");
const sharp = require("sharp");

const router = express.Router({ mergeParams: true });

// Activity as plain JSON plus a `photos` array: the creator's cover photo
// first, then up to a few random photos from outings that used it.
const withPhotos = async (activity, numPhotos = 1) => {
  let photos = [];
  if (activity.cover_photo) {
    photos.push(
      await getSignedURLFromS3(process.env.AWS_BUCKET, activity.cover_photo)
    );
  }
  let remainingOutings = [...(activity.outings || [])];
  while (photos.length < 6 && remainingOutings[0]) {
    const randIndex = Math.floor(Math.random() * remainingOutings.length);
    const outing = await Outing.findById(remainingOutings[randIndex]);
    for (let i = 0; i < outing?.photos.length && i < 6; i++) {
      photos.push(
        await getSignedURLFromS3(process.env.AWS_BUCKET, outing.photos[i].key)
      );
    }
    remainingOutings.splice(randIndex, 1);
  }
  const plain = JSON.parse(JSON.stringify(activity));
  plain.photos = photos.length > numPhotos ? photos.slice(0, numPhotos) : photos;
  return plain;
};


// Names share the card's top row with the stats (client: utils/limits.js)
const ACTIVITY_NAME_MAX = 20;
const ACTIVITY_DESCRIPTION_MAX = 50;
// Instructions: an icon (kind) plus a short free-text title
const INSTRUCTION_TITLE_MAX = 15;
const INSTRUCTION_KINDS = [
  "communicate",
  "purchase",
  "travel",
  "play",
  "capture",
  "create",
  "eat",
  "meet",
  "explore",
];

router.get(
  "/get-all",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findOne({
      username: req.session.passport.user,
    }).populate("activities");

    if (!user) {
      res.status(406).send({
        header: req.t("activity.fetchLoggedOut.header"),
        message: req.t("activity.fetchLoggedOut.message"),
      });
      return;
    }

    let activities = await Activity.find({
      $and: [
        {
          $or: [{ location: "Global" }, { location: user.location }],
        },
        { $nor: [{ created_by: { $exists: true } }, { created_by: user }] },
      ],
    });

    // Get user created activities
    for (let activity of user.activities) {
      if (!activities.find((a) => a._id.toString() === activity._id.toString()))
        activities.push(activity);
    }

    let activitiesWithPhotos = [];
    for (let activity of activities) {
      activitiesWithPhotos.push(await withPhotos(activity));
    }

    res.send({ activities: activitiesWithPhotos });
  })
);

// One activity (e.g. shared in a chat), with photos like /get-all
router.get(
  "/:activityid/details",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const activity = await Activity.findById(req.params.activityid).catch(
      () => null
    );
    if (!activity) {
      res.status(406).send({
        header: req.t("activity.notFound.header"),
        message: req.t("activity.notFound.message"),
      });
      return;
    }
    res.send({ activity: await withPhotos(activity) });
  })
);

// Create new custon activity
router.post(
  "/create",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const { _id, ratings, outings, lobby, featured, created_by, ...fields } =
      req.body.activity || {};
    const name = typeof fields.name === "string" ? fields.name.trim() : "";
    if (!name || name.length > ACTIVITY_NAME_MAX) {
      res.status(406).send({
        header: req.t("activity.nameLength.header"),
        message: req.t("activity.nameLength.message", { max: ACTIVITY_NAME_MAX }),
      });
      return;
    }
    fields.name = name;
    const description =
      typeof fields.description === "string" ? fields.description.trim() : "";
    if (description.length > ACTIVITY_DESCRIPTION_MAX) {
      res.status(406).send({
        header: req.t("activity.descriptionTooLong.header"),
        message: req.t("activity.descriptionTooLong.message", { max: ACTIVITY_DESCRIPTION_MAX }),
      });
      return;
    }
    fields.description = description;
    const instructions = Array.isArray(fields.instructions)
      ? fields.instructions
      : [];
    if (
      instructions.some(
        (i) => String(i?.title || "").trim().length > INSTRUCTION_TITLE_MAX
      )
    ) {
      res.status(406).send({
        header: req.t("activity.instructionTitleTooLong.header"),
        message: req.t("activity.instructionTitleTooLong.message", { max: INSTRUCTION_TITLE_MAX }),
      });
      return;
    }
    fields.instructions = instructions.map((i, n) => ({
      kind: INSTRUCTION_KINDS.includes(String(i?.kind).toLowerCase())
        ? String(i.kind).toLowerCase()
        : "communicate",
      title: String(i?.title || "").trim(),
      details: String(i?.details || "").slice(0, 2000),
      number: n,
    }));
    delete fields.cover_photo; // only ever set from an uploaded photo below
    // Cover framing chosen in the drawer: two percentages, nothing else
    const pos = String(fields.cover_position || "");
    fields.cover_position = /^(100|\d{1,2})% (100|\d{1,2})%$/.test(pos) ? pos : undefined;

    // Optional cover photo (data URL). Validate + shrink before saving
    // anything, so a bad image doesn't leave a half-created activity.
    let coverBuffer = null;
    if (req.body.photoString) {
      try {
        coverBuffer = await sharp(decodeDataURL(req.body.photoString))
          .rotate() // respect EXIF orientation from phone cameras
          .resize({
            width: 1200,
            height: 1200,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 70 })
          .toBuffer();
      } catch (e) {
        res.status(406).send({
          header: req.t("activity.badPhoto.header"),
          message: req.t("activity.badPhoto.message"),
        });
        return;
      }
    }

    const activity = new Activity(fields);
    // Store ids, not documents: the user and activity referenced each other,
    // which made the response circular (every create returned a 500)
    activity.created_by = user._id;
    // The city picked in the form, falling back to the user's own city
    activity.location =
      typeof fields.location === "string" && fields.location.trim()
        ? fields.location.slice(0, 200)
        : user.location;
    if (coverBuffer) {
      const key = `activity-${activity._id.toString()}-${Date.now()}`;
      await uploadToS3(process.env.AWS_BUCKET, key, coverBuffer);
      activity.cover_photo = key;
    }
    await activity.save();
    user.activities.push(activity._id);
    await user.save();

    pushUserUpdate([user]);

    const created = activity.toObject();
    created.photos = activity.cover_photo
      ? [await getSignedURLFromS3(process.env.AWS_BUCKET, activity.cover_photo)]
      : [];
    res.send({ activity: created });
  })
);

// Delete a custom activity
router.post(
  "/delete",
  reqAuthenticated,
  sameUserOnly,
  tryCatch(async (req, res) => {
    const user = req.user;
    const activity = await Activity.findById(
      req.body.activity?._id || req.body.activity
    );

    // Previously `!a == b` (always false) let anyone delete any activity
    if (!activity || activity.created_by?.toString() !== user._id.toString()) {
      res.status(406).send({
        header: req.t("activity.deleteNotOwner.header"),
        message: req.t("activity.deleteNotOwner.message"),
      });
      return;
    }

    user.activities = user.activities
      .map((a) => a.toString())
      .filter((aid) => aid !== activity._id.toString());
    await user.save();
    //await Activity.findByIdAndDelete(activity._id.toString());

    pushUserUpdate([user]);
    res.sendStatus(200);
  })
);

module.exports = router;
