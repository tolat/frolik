// Runs the activity-art sync (utils/activityArt.js) by hand. The live server
// already does this by itself on start, so this is for checking a database
// or forcing a re-upload.
//   DB_URL=<db> node scripts/update-activity-art.js                  # preview
//   DB_URL=<db> node scripts/update-activity-art.js --apply          # write
//   DB_URL=<db> node scripts/update-activity-art.js --apply --force  # re-upload all art
// For a live database pass the live S3 settings as well (STORAGE=s3 plus the
// AWS_* variables); the script refuses a remote DB with local image storage.
require("dotenv").config();
const mongoose = require("mongoose");
const { useLocalStorage } = require("../utils/S3");
const { syncActivityArt } = require("../utils/activityArt");

(async () => {
  const apply = process.argv.includes("--apply");
  const force = process.argv.includes("--force");
  // A live (remote) database with local image storage would point the live
  // activities at covers that only exist on this computer: refuse that.
  const remoteDb = !/localhost|127\.0\.0\.1/.test(process.env.DB_URL || "");
  if (remoteDb && useLocalStorage) {
    throw new Error(
      "DB_URL is a remote database but images would go to local-storage/ " +
        "(STORAGE=local in .env, or no AWS_BUCKET). Run it with the live " +
        "S3 settings too: STORAGE=s3 AWS_BUCKET=... AWS_ACCESS_KEY_ID=... " +
        "AWS_SECRET_ACCESS_KEY=... AWS_DEFAULT_REGION=..."
    );
  }
  await mongoose.connect(process.env.DB_URL);
  console.log(`Images go to ${useLocalStorage ? "local-storage/" : `bucket ${process.env.AWS_BUCKET}`}\n`);
  const r = await syncActivityArt({ apply, force, log: console.log });
  console.log(apply ? `\nSaved (${r.updated} updated, ${r.upToDate} already up to date).` : "\nPreview only. Re-run with --apply to save.");
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
