// Brings a database's built-in activities in line with seeds/activity.js:
//  - renames "Beach Glass Rainbow" to "Find The Rainbow" (same record, so its
//    outings stay linked) with the new description and steps
//  - sets every built-in activity's illustrated cover (cover_photo) and
//    uploads the art from seeds/images/activity-art to the app's image
//    storage (local-storage/ or AWS_BUCKET, like the rest of the app)
// Only built-in activities (no created_by) are touched.
//   DB_URL=<db> node scripts/update-activity-art.js            # preview
//   DB_URL=<db> node scripts/update-activity-art.js --apply    # write
// Needs the AWS_* variables for a live S3 bucket.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const { uploadToS3, useLocalStorage } = require("../utils/S3");
const { activitySeeds } = require("../seeds/activity");

const ART = path.join(__dirname, "../seeds/images/activity-art");
const RENAMES = { "Find The Rainbow": "Beach Glass Rainbow" }; // new: old
const BUILT_IN = { $or: [{ created_by: { $exists: false } }, { created_by: null }] };
const RENAME_FIELDS = ["name", "description", "category", "goal", "featured", "instructions", "location", "duration", "cost", "participants"];

(async () => {
  const apply = process.argv.includes("--apply");
  await mongoose.connect(process.env.DB_URL);
  console.log(`Images go to ${useLocalStorage ? "local-storage/" : `bucket ${process.env.AWS_BUCKET}`}\n`);

  let missing = 0;
  for (const seed of activitySeeds) {
    let activity = await Activity.findOne({ name: seed.name, ...BUILT_IN });
    let renamed = false;
    if (!activity && RENAMES[seed.name]) {
      activity = await Activity.findOne({ name: RENAMES[seed.name], ...BUILT_IN });
      renamed = !!activity;
    }
    if (!activity) {
      console.log(`  -  ${seed.name}: not in this database (skipped)`);
      missing++;
      continue;
    }
    const file = path.join(ART, `${seed.cover_photo}.jpeg`);
    if (!fs.existsSync(file)) throw new Error(`Missing art file ${file}`);
    const changes = [];
    if (renamed) changes.push(`rename "${activity.name}" -> "${seed.name}"`);
    if (activity.cover_photo !== seed.cover_photo) changes.push(`cover ${activity.cover_photo || "(none)"} -> ${seed.cover_photo}`);
    console.log(`  ${changes.length ? "*" : "="}  ${seed.name}: ${changes.join(", ") || "cover up to date (re-uploads the art)"}`);

    if (apply) {
      await uploadToS3(process.env.AWS_BUCKET, seed.cover_photo, fs.readFileSync(file));
      if (renamed) {
        for (const f of RENAME_FIELDS) activity[f] = seed[f];
        activity.markModified("instructions");
      }
      activity.cover_photo = seed.cover_photo;
      await activity.save();
    }
  }
  console.log(apply ? "\nSaved." : "\nPreview only. Re-run with --apply to save.");
  if (missing) console.log(`${missing} seed activit${missing === 1 ? "y was" : "ies were"} not found (fine if that database doesn't have them).`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
