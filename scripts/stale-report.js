// Read-only report of what the stale-outing job has done (who was removed,
// whose invite expired, which outings were deleted), from the alerts it sent.
//
// Usage (the URL is read from the environment, never hard-coded):
//   STALE_REPORT_DB_URL="<live MongoDB connection string>" \
//     node scripts/stale-report.js
//
// It only reads; it changes nothing.
const mongoose = require("mongoose");
const User = require("../models/user");
const Outing = require("../models/outing");

const KIND = {
  "Removed from an Outing": "removed + FLAKE (didn't mark completed)",
  "Outing invite expired": "invite expired (no flake)",
  "Outing deleted for inactivity": "outing deleted (no one joined)",
  "Pending invites expired": "outing kept; its pending invites expired",
  "Mark your Outing completed": "reminder: mark completed",
  "Your Outing invite expires soon": "reminder: invite expiring",
  "No one has joined your Outing yet": "reminder: outing will be deleted",
};

(async () => {
  const url = process.env.STALE_REPORT_DB_URL;
  if (!url) {
    console.error("Set STALE_REPORT_DB_URL to the database connection string.");
    process.exit(1);
  }
  await mongoose.connect(url, { family: 4 });

  const users = await User.find(
    { "notifications.type": "outing-notice" },
    "first_name last_name username notifications outings"
  );
  const rows = [];
  for (const u of users) {
    for (const n of u.notifications) {
      if (n.type !== "outing-notice") continue;
      rows.push({
        when: new Date(n.created).toISOString().replace("T", " ").slice(0, 16),
        who: `${u.first_name} ${u.last_name}`,
        what: KIND[n.title] || n.title,
        outing: n.outingName || (n.message.match(/"([^"]+)"/) || [])[1] || "",
      });
    }
  }
  rows.sort((a, b) => a.when.localeCompare(b.when));

  const actions = rows.filter((r) => !r.what.startsWith("reminder"));
  console.log(`\nStale-outing actions (${actions.length}):`);
  console.table(actions);
  const reminders = rows.filter((r) => r.what.startsWith("reminder"));
  console.log(`\nReminders sent (${reminders.length}):`);
  console.table(reminders);

  // Cross-check: everyone now listed as a flake on an outing the job finished
  const booted = await Outing.find(
    { date_completed: { $exists: true }, "flakes.0": { $exists: true } },
    "name flakes users date_completed"
  ).populate("flakes", "first_name last_name");
  console.log("\nOutings with flaked members (any cause):");
  console.table(
    booted.map((o) => ({
      outing: o.name,
      flaked: o.flakes.map((f) => `${f.first_name} ${f.last_name}`).join(", "),
      remaining: o.users.length,
      completed: new Date(o.date_completed).toISOString().slice(0, 10),
    }))
  );

  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
