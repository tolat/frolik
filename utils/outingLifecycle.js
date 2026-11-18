// Outing lifecycle rules shared by the routes and the hourly stale-outing job.
//
// Stale outings (checked every hour):
//  1. Waiting for members — clock starts when the outing is created. After
//     STALE_DAYS, invites still pending are removed. With 2+ members left the
//     outing carries on; with only 1 it is deleted for inactivity.
//  2. Waiting for others to finish — clock starts at the first "Mark
//     Completed". After STALE_DAYS, members who haven't marked it completed
//     are removed and get a flake (same as leaving); the outing then finishes.
// Reminders go out REMINDER_DAYS before each deadline (alert + push), once.

const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const Chat = require("../models/chat");
const { deleteFromS3 } = require("./S3");
const { pushUserUpdate, webpushNotify } = require("./utils");
const { tr, userLang, forUser } = require("./i18n");

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_DAYS = 30;
const REMINDER_DAYS = [7, 3];

const idStr = (u) => (u?._id || u).toString();
const sameID = (a, b) => idStr(a) === idStr(b);

// Stage 1 clock: when the outing was created. (Applies to existing outings
// too — the rules took effect immediately when this shipped.)
const inviteClockStart = (outing) => outing.date_created;
const inviteDeadline = (outing) =>
  new Date(new Date(inviteClockStart(outing)).getTime() + STALE_DAYS * DAY_MS);
const completionDeadline = (outing) =>
  outing.completion_started
    ? new Date(new Date(outing.completion_started).getTime() + STALE_DAYS * DAY_MS)
    : null;
const daysLeft = (deadline, now = Date.now()) =>
  Math.ceil((deadline.getTime() - now) / DAY_MS);

// An in-app alert (rendered by the client's OutingNotice) plus a push.
// `key` is an i18n prefix ("notice.x" → notice.x.title / notice.x.message);
// the stored title/message are written in each recipient's language, and
// key/vars are kept on the alert too so the client can re-render it.
const notify = async (userIDs, { key, vars = {}, outing, url }) => {
  if (!userIDs.length) return;
  const base = {
    type: "outing-notice",
    key,
    vars,
    outing: outing ? outing._id.toString() : undefined,
    outingName: outing?.name,
    created: new Date(),
    active: true,
  };
  const recipients = await User.find({ _id: { $in: userIDs } }).select("language");
  const byLang = {};
  for (const u of recipients) (byLang[userLang(u)] ||= []).push(u._id);
  for (const [lang, ids] of Object.entries(byLang)) {
    await User.updateMany(
      { _id: { $in: ids } },
      {
        $push: {
          notifications: {
            id: Date.now() + Math.random(),
            ...base,
            title: tr(lang, `${key}.title`, vars),
            message: tr(lang, `${key}.message`, vars),
          },
        },
      }
    );
  }
  pushUserUpdate(userIDs);
  webpushNotify(userIDs, {
    title: forUser(`${key}.title`, vars),
    body: forUser(`${key}.message`, vars),
    url: url || "/alerts",
  });
};

// All members have marked it completed: finish the outing (shared with the
// add-completion route)
const finalizeOuting = async (outing, activity) => {
  outing.date_completed = new Date();

  for (const u of outing.users) {
    await User.updateOne(
      { _id: u },
      {
        $push: {
          notifications: {
            id: Date.now() + Math.random(),
            type: "outing-complete",
            outing: outing._id.toString(),
            created: new Date(),
            active: true,
          },
        },
      }
    );
  }

  // Clear any invite notifications still around for this outing
  for (const u of outing.invited) {
    await User.updateOne(
      { _id: u },
      { $pull: { notifications: { outing: outing._id.toString() } } }
    );
  }
  outing.invited = [];

  const act = activity || (await Activity.findById(outing.activity));
  if (act && !act.outings.some((o) => sameID(o, outing))) {
    act.outings.push(outing._id);
    await act.save();
  }
};

// Delete an outing and everything hanging off it (same as the delete route)
const deleteOutingCompletely = async (outing) => {
  const outingID = outing._id.toString();
  if (outing.chat) {
    await Chat.deleteOne({ _id: outing.chat });
    await User.updateMany({ chats: outing.chat }, { $pull: { chats: outing.chat } });
  }
  await User.updateMany(
    { $or: [{ outings: outing._id }, { "notifications.outing": outingID }] },
    { $pull: { outings: outing._id, notifications: { outing: outingID } } }
  );
  await Activity.updateOne({ _id: outing.activity }, { $pull: { outings: outing._id } });
  for (const p of outing.photos || []) {
    deleteFromS3(process.env.AWS_BUCKET, p.key).catch((e) =>
      console.error("Error deleting outing photo:", e.message)
    );
  }
  await Outing.deleteOne({ _id: outing._id });
};

// ── Stage 1: invites still pending ───────────────────────────────────────────
const processInvites = async (outing, now) => {
  const deadline = inviteDeadline(outing);
  const left = daysLeft(deadline, now);
  const lone = outing.users.length < 2;

  if (left > 0) {
    for (const d of REMINDER_DAYS) {
      const key = `invite-${d}`;
      if (left <= d && !outing.reminders_sent.includes(key)) {
        outing.reminders_sent.push(key);
        await notify(outing.invited.map(idStr), {
          key: "notice.inviteExpiring",
          vars: { outing: outing.name, count: left },
          outing,
        });
        if (lone) {
          await notify(outing.users.map(idStr), {
            key: "notice.noOneJoined",
            vars: { outing: outing.name, count: left },
            outing,
          });
        }
        await outing.save();
        break; // one reminder per run
      }
    }
    return "waiting";
  }

  // Deadline passed: drop the pending invites
  const expired = outing.invited.map(idStr);
  outing.invited = [];
  await User.updateMany(
    { _id: { $in: expired } },
    { $pull: { notifications: { outing: outing._id.toString(), type: "outing-invite" } } }
  );
  await notify(expired, {
    key: "notice.inviteExpired",
    vars: { outing: outing.name, days: STALE_DAYS },
  });

  if (outing.users.length >= 2) {
    await outing.save();
    await notify(outing.users.map(idStr), {
      key: "notice.invitesExpired",
      vars: { outing: outing.name, days: STALE_DAYS },
      outing,
    });
    return "invites-expired";
  }

  const members = outing.users.map(idStr);
  await deleteOutingCompletely(outing);
  await notify(members, {
    key: "notice.deletedInactive",
    vars: { outing: outing.name, days: STALE_DAYS },
  });
  return "deleted";
};

// ── Stage 2: waiting for others to mark it completed ─────────────────────────
const processCompletions = async (outing, now) => {
  // Outings already waiting before completion_started existed: their exact
  // first-completion date is unknown, so the clock runs from creation (the
  // rules apply to existing outings immediately)
  if (!outing.completion_started) {
    outing.completion_started = outing.date_created;
    await outing.save();
  }

  const pending = outing.users.filter(
    (u) => !outing.completions.some((c) => sameID(c, u))
  );
  const deadline = completionDeadline(outing);
  const left = daysLeft(deadline, now);

  if (left > 0) {
    for (const d of REMINDER_DAYS) {
      const key = `complete-${d}`;
      if (left <= d && !outing.reminders_sent.includes(key)) {
        outing.reminders_sent.push(key);
        await notify(pending.map(idStr), {
          key: "notice.completeReminder",
          vars: { outing: outing.name, count: left },
          outing,
        });
        await outing.save();
        break;
      }
    }
    return "waiting";
  }

  // Deadline passed: remove anyone who hasn't completed, with a flake
  const booted = pending.map(idStr);
  for (const id of booted) {
    if (!outing.flakes.some((f) => sameID(f, id))) outing.flakes.push(id);
  }
  outing.users = outing.users.filter((u) => !booted.includes(idStr(u)));
  // (they keep the outing in their list so the flake counts, like leaving)
  await User.updateMany(
    { _id: { $in: booted } },
    { $pull: { notifications: { outing: outing._id.toString(), type: { $ne: "outing-notice" } } } }
  );

  await finalizeOuting(outing);
  await outing.save();

  await notify(booted, {
    key: "notice.removed",
    vars: { outing: outing.name, days: STALE_DAYS },
    outing,
  });
  pushUserUpdate(outing.users.map(idStr));
  return "booted";
};

// One pass over every unfinished outing
// (`filter` narrows the outings checked — used by tests)
const processStaleOutings = async (now = Date.now(), filter = {}) => {
  const outings = await Outing.find({
    ...filter,
    date_completed: { $exists: false },
  });
  const results = {};
  for (const outing of outings) {
    try {
      if (!outing.reminders_sent) outing.reminders_sent = [];
      let result = null;
      // Stage 1 also covers a lone member with no invites left
      if (outing.invited.length || outing.users.length < 2) {
        result = await processInvites(outing, now);
      } else if (outing.completions.length && outing.users.length >= 2) {
        result = await processCompletions(outing, now);
      }
      if (result) results[result] = (results[result] || 0) + 1;
    } catch (err) {
      console.error(`[stale outings] ${outing._id}:`, err.message);
    }
  }
  return results;
};

const startStaleOutingJob = () => {
  const run = () =>
    processStaleOutings()
      .then((r) => Object.keys(r).length && console.log("[stale outings]", r))
      .catch((err) => console.error("[stale outings]", err.message));
  setTimeout(run, 30 * 1000); // shortly after start-up
  setInterval(run, 60 * 60 * 1000); // then hourly
};

module.exports = {
  STALE_DAYS,
  REMINDER_DAYS,
  inviteDeadline,
  completionDeadline,
  finalizeOuting,
  deleteOutingCompletely,
  processStaleOutings,
  startStaleOutingJob,
};
