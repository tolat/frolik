// Preview (default) or send the weekly pushes now, ignoring the day/hour.
//   node scripts/send-weekly-nudge.js                       # dry run: who gets what
//   node scripts/send-weekly-nudge.js --send --user a@b.c   # send to one person
// Add --again to send even if they already got this week's, and --test to
// send both kinds even when there's nothing to count (shows 1 as the count).
// Uses DB_URL and the VAPID keys from the environment / .env; it does NOT
// start the server or its background jobs.
require("dotenv").config();
const mongoose = require("mongoose");
const webpush = require("web-push");
const { sendWeeklyNudges } = require("../utils/weeklyNudge");

(async () => {
  const args = process.argv.slice(2);
  const send = args.includes("--send");
  const userIdx = args.indexOf("--user");
  const filter = userIdx >= 0 ? { username: String(args[userIdx + 1]).toLowerCase() } : {};
  if (send && !filter.username) throw new Error("--send needs --user <email>");
  if (send) {
    webpush.setVapidDetails(
      `mailto:${process.env.SENDMAIL_FROM}`,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }
  await mongoose.connect(process.env.DB_URL);
  const result = await sendWeeklyNudges({
    force: true,
    dryRun: !send,
    ignoreWeekLimit: args.includes("--again"),
    testCounts: args.includes("--test"),
    filter,
  });
  console.log(JSON.stringify(result, null, 2));
  if (send && filter.username && !Object.keys(result.sent || {}).length) {
    console.log("Nothing sent: check the account exists, is verified and has notifications on (or use --test).");
  }
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
