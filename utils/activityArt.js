// Keeps the database's built-in activities in line with seeds/activity.js:
//  - renames "Beach Glass Rainbow" to "Find The Rainbow" (same record, so its
//    outings stay linked) with the new description and steps
//  - gives every built-in activity its illustrated cover (cover_photo) and
//    uploads the art from seeds/images/activity-art to the app's image
//    storage (local-storage/ or AWS_BUCKET, like the rest of the app)
// Only built-in activities (no created_by) are touched, and an activity whose
// cover already matches is left alone, so running it again does nothing.
// Runs on server start (server.js) and from scripts/update-activity-art.js.
const fs = require("fs");
const path = require("path");
const Activity = require("../models/activity");
const { uploadToS3 } = require("./S3");
const { activitySeeds } = require("../seeds/activity");

const ART = path.join(__dirname, "../seeds/images/activity-art");
const RENAMES = { "Find The Rainbow": "Beach Glass Rainbow" }; // new: old
const BUILT_IN = { $or: [{ created_by: { $exists: false } }, { created_by: null }] };
const RENAME_FIELDS = ["name", "description", "category", "goal", "featured", "instructions", "location", "duration", "cost", "participants"];

// apply: false = only report. force: re-upload art even when up to date.
const syncActivityArt = async ({ apply = true, force = false, log = () => {} } = {}) => {
  const result = { updated: 0, upToDate: 0, missing: 0 };
  for (const seed of activitySeeds) {
    if (!seed.cover_photo) continue;
    let activity = await Activity.findOne({ name: seed.name, ...BUILT_IN });
    let renamed = false;
    if (!activity && RENAMES[seed.name]) {
      activity = await Activity.findOne({ name: RENAMES[seed.name], ...BUILT_IN });
      renamed = !!activity;
    }
    if (!activity) {
      log(`  -  ${seed.name}: not in this database (skipped)`);
      result.missing++;
      continue;
    }
    const file = path.join(ART, `${seed.cover_photo}.jpeg`);
    if (!fs.existsSync(file)) throw new Error(`Missing art file ${file}`);

    const needsCover = activity.cover_photo !== seed.cover_photo;
    if (!renamed && !needsCover && !force) {
      log(`  =  ${seed.name}: up to date`);
      result.upToDate++;
      continue;
    }
    const changes = [];
    if (renamed) changes.push(`rename "${activity.name}" -> "${seed.name}"`);
    if (needsCover) changes.push(`cover ${activity.cover_photo || "(none)"} -> ${seed.cover_photo}`);
    log(`  *  ${seed.name}: ${changes.join(", ") || "re-upload art"}`);

    if (apply) {
      // Upload first: the record only points at the art once the art exists
      await uploadToS3(process.env.AWS_BUCKET, seed.cover_photo, fs.readFileSync(file));
      if (renamed) {
        for (const f of RENAME_FIELDS) activity[f] = seed[f];
        activity.markModified("instructions");
      }
      activity.cover_photo = seed.cover_photo;
      await activity.save();
    }
    result.updated++;
  }
  return result;
};

// On server start: apply whatever is missing, quietly when nothing is
const startActivityArtSync = () => {
  setTimeout(() => {
    syncActivityArt({ apply: true })
      .then((r) => {
        if (r.updated) console.log(`[activity-art] updated ${r.updated} activit${r.updated === 1 ? "y" : "ies"}`);
      })
      .catch((err) => console.error("[activity-art] failed:", err.message));
  }, 20 * 1000);
};

module.exports = { syncActivityArt, startActivityArtSync };
