// Replaces the "Beach Glass Rainbow" activity with "Find The Rainbow" in
// whichever database DB_URL points at, keeping the same record (so outings
// that used it stay linked), and uploads its cover photo to the app's image
// storage (local-storage/ or the AWS_BUCKET, like the rest of the app).
//   DB_URL=<db> node scripts/replace-beach-glass.js            # preview
//   DB_URL=<db> node scripts/replace-beach-glass.js --apply    # write
// Needs the AWS_* variables for a live S3 bucket.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const sharp = require("sharp");
const Activity = require("../models/activity");
const { uploadToS3, useLocalStorage } = require("../utils/S3");
const { activitySeeds } = require("../seeds/activity");

const OLD_NAME = "Beach Glass Rainbow";
const NEW_NAME = "Find The Rainbow";
const PHOTO = path.join(__dirname, "../seeds/images/sampleUserPhotos/findtherainbow.jpeg");

(async () => {
  const apply = process.argv.includes("--apply");
  const seed = activitySeeds.find((a) => a.name === NEW_NAME);
  if (!seed) throw new Error("Find The Rainbow is missing from seeds/activity.js");

  await mongoose.connect(process.env.DB_URL);
  const activity =
    (await Activity.findOne({ name: OLD_NAME })) || (await Activity.findOne({ name: NEW_NAME }));
  if (!activity) throw new Error(`No "${OLD_NAME}" (or "${NEW_NAME}") activity in this database`);

  const fields = ["name", "description", "category", "goal", "featured", "instructions", "location", "duration", "cost", "participants", "cover_photo"];
  console.log(`Activity ${activity._id} ("${activity.name}"), used by ${activity.outings.length} outing(s)`);
  for (const f of fields) {
    const before = JSON.stringify(activity[f] ?? null);
    const after = JSON.stringify(seed[f] ?? null);
    if (before !== after) console.log(`  ${f}: ${before.slice(0, 70)}  ->  ${after.slice(0, 70)}`);
  }
  console.log(`  photo "${seed.cover_photo}" -> ${useLocalStorage ? "local-storage/" : `bucket ${process.env.AWS_BUCKET}`}`);

  if (!apply) {
    console.log("\nPreview only. Re-run with --apply to save.");
  } else {
    const image = await sharp(fs.readFileSync(PHOTO)).jpeg({ quality: 70 }).toBuffer();
    await uploadToS3(process.env.AWS_BUCKET, seed.cover_photo, image);
    for (const f of fields) activity[f] = seed[f];
    activity.markModified("instructions");
    await activity.save();
    console.log("\nSaved.");
  }
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
