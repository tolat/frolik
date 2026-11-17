const express = require("express");
const router = express.Router({ mergeParams: true });
const webpush = require("web-push");
const User = require("../models/user");
const { tryCatch, reqAuthenticated } = require("../utils/middleware");

// VAPID keys are initialized once in server.js at startup

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post(
  "/push/subscribe",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const subscription = req.body.subscription;

    // Save push subscription to the logged-in user (previously any client
    // could attach its subscription to any user id and receive their pushes)
    const user = await User.findOne({ username: req.session.passport.user });
    if (!user || !subscription?.endpoint) return res.sendStatus(406);
    user.pushSubscription = subscription;
    await user.save();

    const payload = JSON.stringify({
      title: "Subscribed!",
      body: "You have successfully subscribed to push notifications!",
    });

    webpush.sendNotification(subscription, payload).catch(async (error) => {
      if (error.statusCode === 410 || error.statusCode === 404) {
        // Subscription already invalid — clear it so we stop hitting a dead endpoint
        user.pushSubscription = undefined;
        await user.save();
      } else {
        console.error("Error sending subscribe confirmation:", error.message);
      }
    });

    res.sendStatus(200);
  })
);

router.post(
  "/push/test",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findOne({ username: req.session.passport.user });
    const subscription = user?.pushSubscription;
    if (!subscription) return res.sendStatus(406);

    const payload = JSON.stringify({
      title: "Test Notification",
      body: "Success!",
    });

    webpush.sendNotification(subscription, payload).catch(async (error) => {
      if (error.statusCode === 410 || error.statusCode === 404) {
        user.pushSubscription = undefined;
        await user.save();
      } else {
        console.error("Error sending test notification:", error.message);
      }
    });

    res.sendStatus(200);
  })
);

module.exports = router;
