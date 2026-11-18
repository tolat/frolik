// Two weekly pushes, each on a random day per person per week (never the same
// day for one person), at 5 pm Vancouver time, in the person's language:
//  - matches: "New Daily Matches are waiting", if someone nearby is
//    available to match with (locales: push.weekly.v1–v4, rotating)
//  - friends: "Join the fun! N of your friends posted Outings this week", if
//    at least one friend completed an Outing in the last 7 days
//    (locales: push.friends.v1–v3, rotating)
// Each is sent at most once per calendar week (user.weekly_nudges.<kind>
// holds the week it was last sent, e.g. "2026-W47").
const crypto = require("crypto");
const User = require("../models/user");
const Outing = require("../models/outing");
// Looked up when used, not at load: utils.js sits in a require cycle with
// server.js, so destructuring here could capture undefined
const utils = require("./utils");
const { forUser } = require("./i18n");

const TIME_ZONE = "America/Vancouver";
const SEND_HOUR = 17; // 5 pm local
const DAY_MS = 24 * 60 * 60 * 1000;
const MATCH_RADIUS_KM = 50;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Local (Vancouver) weekday, hour and ISO week, e.g. { day: 4, hour: 17, week: "2026-W47" }
const localClock = (date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const y = Number(get("year"));
  const m = Number(get("month"));
  const d = Number(get("day"));
  // ISO week of the local calendar date
  const utc = new Date(Date.UTC(y, m - 1, d));
  const isoDay = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - isoDay);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utc - yearStart) / DAY_MS + 1) / 7);
  return {
    day: DAYS.indexOf(get("weekday")),
    hour: Number(get("hour")),
    week: `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`,
    weekIndex: utc.getUTCFullYear() * 53 + weekNo,
  };
};

// This person's random days this week: stable for the week, different every
// week, and never the same day for both nudges
const hashInt = (text) =>
  parseInt(crypto.createHash("sha256").update(text).digest("hex").slice(0, 8), 16);
const pickDays = (userID, week) => {
  const matches = hashInt(`${userID}:${week}:matches`) % 7;
  const friends = (matches + 1 + (hashInt(`${userID}:${week}:friends`) % 6)) % 7;
  return { matches, friends };
};

// People this user could be matched with right now (same rules as Daily
// Matches: Ready, nearby, not a friend, not themselves)
const availableMatchCount = (user) => {
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
  return User.countDocuments({
    "status.status": "Ready",
    $or: nearby,
    _id: { $ne: user._id, $nin: user.friends || [] },
  });
};

// Friends who completed (posted) an Outing in the last 7 days
const friendsWhoPosted = async (user, now) => {
  if (!user.friends?.length) return 0;
  const outings = await Outing.find(
    {
      users: { $in: user.friends },
      date_completed: { $gte: new Date(now.getTime() - 7 * DAY_MS) },
    },
    { users: 1 }
  );
  const friendIDs = new Set(user.friends.map(String));
  const posted = new Set();
  for (const o of outings)
    for (const u of o.users) if (friendIDs.has(String(u))) posted.add(String(u));
  return posted.size;
};

const KINDS = {
  matches: {
    variants: ["v1", "v2", "v3", "v4"],
    key: "push.weekly",
    url: "/outing",
    count: async (user) => {
      // Can't start new Outings with 5 pending: nothing to nudge toward
      const pending = (user.outings || []).filter((o) => o && utils.outingIsPending(user, o));
      if (pending.length >= 5) return 0;
      return availableMatchCount(user);
    },
  },
  friends: {
    variants: ["v1", "v2", "v3"],
    key: "push.friends",
    url: "/social",
    count: (user, now) => friendsWhoPosted(user, now),
  },
};

// Sends whatever is due right now. Options (for scripts/send-weekly-nudge.js):
//   force: ignore the day/hour (send every kind now), kinds: ["matches"],
//   ignoreWeekLimit: send even if already sent this week, filter: extra query
const sendWeeklyNudges = async ({
  now = new Date(),
  force = false,
  ignoreWeekLimit = false,
  kinds = Object.keys(KINDS),
  filter = {},
  dryRun = false, // list what would be sent; send and record nothing
  testCounts = false, // testing: send even with nothing to count (count 1)
} = {}) => {
  const clock = localClock(now);
  if (!force && clock.hour !== SEND_HOUR) return { sent: {}, skipped: "not 5 pm" };

  const users = await User.find({
    "status.status": { $in: ["Ready", "Busy"] }, // verified, not inactive
    ...(dryRun ? {} : { "pushSubscriptions.0": { $exists: true } }),
    ...filter,
  }).populate("outings");

  const sent = {};
  const preview = [];
  for (const user of users) {
    const days = pickDays(String(user._id), clock.week);
    for (const kind of kinds) {
      const spec = KINDS[kind];
      if (!force && days[kind] !== clock.day) continue;
      if (!ignoreWeekLimit && user.weekly_nudges?.[kind] === clock.week) continue;

      let count = await spec.count(user, now);
      if (count < 1 && testCounts) count = 1;
      if (count < 1) continue;

      const variant = spec.variants[clock.weekIndex % spec.variants.length];
      if (dryRun) {
        preview.push({
          user: `${user.first_name} ${user.last_name}`,
          language: user.language,
          kind,
          day: DAYS[days[kind]],
          title: forUser(`${spec.key}.${variant}.title`)(user),
          body: forUser(`${spec.key}.${variant}.body`, { count })(user),
        });
        continue;
      }
      await utils.webpushNotify([user], {
        title: forUser(`${spec.key}.${variant}.title`),
        body: forUser(`${spec.key}.${variant}.body`, { count }),
        url: spec.url,
      });
      await User.updateOne(
        { _id: user._id },
        { $set: { [`weekly_nudges.${kind}`]: clock.week } }
      );
      sent[kind] = (sent[kind] || 0) + 1;
    }
  }
  return { sent, week: clock.week, considered: users.length, ...(dryRun ? { preview } : {}) };
};

const startWeeklyNudgeJob = () => {
  const run = () =>
    sendWeeklyNudges().catch((err) =>
      console.error("[weekly-nudge] failed:", err.message)
    );
  setTimeout(run, 45 * 1000); // shortly after start-up
  setInterval(run, 60 * 60 * 1000); // then hourly (sends only at 5 pm local)
};

module.exports = { sendWeeklyNudges, startWeeklyNudgeJob, localClock, pickDays };
