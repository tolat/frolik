const express = require("express");
const router = express.Router({ mergeParams: true });
const webpush = require("web-push");
const User = require("../models/user");
const { tryCatch, reqAuthenticated } = require("../utils/middleware");
const { userSubscriptions } = require("../utils/utils");
const { tr, userLang } = require("../utils/i18n");

// VAPID keys are initialized once in server.js at startup

const MAX_DEVICES = 5;

const sessionUser = (req) => User.findOne({ username: req.session.passport.user });

const cleanSubscription = (sub) =>
  sub?.endpoint && sub?.keys?.p256dh && sub?.keys?.auth
    ? { endpoint: String(sub.endpoint), keys: { p256dh: String(sub.keys.p256dh), auth: String(sub.keys.auth) } }
    : null;

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

// Register this device's push subscription for the logged-in user. The client
// calls this on every app load once permission is granted, so it is
// idempotent; it also moves a shared device's subscription to whoever is
// logged in now.
router.post(
  "/push/subscribe",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const subscription = cleanSubscription(req.body.subscription);
    const user = await sessionUser(req);
    if (!user || !subscription) return res.sendStatus(406);

    // A device belongs to one account at a time
    await User.updateMany(
      { _id: { $ne: user._id }, "pushSubscriptions.endpoint": subscription.endpoint },
      { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
    );
    await User.updateMany(
      { _id: { $ne: user._id }, "pushSubscription.endpoint": subscription.endpoint },
      { $unset: { pushSubscription: "" } }
    );

    const existing = userSubscriptions(user);
    const isNew = !existing.some((s) => s.endpoint === subscription.endpoint);
    // Only these fields: this runs on every app load, alongside other writes
    // to the same user, and a whole-document save() can fail with VersionError
    const pushSubscriptions = [
      ...existing.filter((s) => s.endpoint !== subscription.endpoint),
      subscription,
    ].slice(-MAX_DEVICES);
    await User.updateOne(
      { _id: user._id },
      { $set: { pushSubscriptions }, $unset: { pushSubscription: "" } }
    );

    // Confirm only the first time this device is registered
    if (isNew) {
      webpush
        .sendNotification(
          subscription,
          JSON.stringify({
            title: tr(userLang(user), "push.subscribed.title"),
            body: tr(userLang(user), "push.subscribed.body"),
            url: "/alerts",
          })
        )
        .catch((error) => console.error("Error sending subscribe confirmation:", error.message));
    }

    res.sendStatus(200);
  })
);

// Remove this device (called on logout so the device stops receiving pushes)
router.post(
  "/push/unsubscribe",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const endpoint = req.body.endpoint && String(req.body.endpoint);
    const user = await sessionUser(req);
    if (!user || !endpoint) return res.sendStatus(406);
    await User.updateOne(
      { _id: user._id },
      { $pull: { pushSubscriptions: { endpoint } } }
    );
    if (user.pushSubscription?.endpoint === endpoint) {
      await User.updateOne({ _id: user._id }, { $unset: { pushSubscription: "" } });
    }
    res.sendStatus(200);
  })
);

router.post(
  "/push/test",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await sessionUser(req);
    const { webpushNotify } = require("../utils/utils");
    const { forUser } = require("../utils/i18n");
    if (!user || !userSubscriptions(user).length) return res.sendStatus(406);
    await webpushNotify([user], {
      title: forUser("push.test.title"),
      body: forUser("push.test.body"),
    });
    res.sendStatus(200);
  })
);

module.exports = router;
