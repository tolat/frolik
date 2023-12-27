const express = require("express");
const router = express.Router({ mergeParams: true });
const webpush = require("web-push");
const User = require("../models/user");
const { tryCatch } = require("../utils/middleware");

webpush.setVapidDetails(
  `mailto:${process.env.SENDMAIL_FROM}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post(
  "/push/subscribe",
  tryCatch(async (req, res) => {
    const subscription = req.body.subscription;

    // Save push subscription to user
    const user = await User.findById(req.body.user._id);
    console.log(
      "\n\nSUBSCRIBING SERVICE WORKER FOR: ",
      user.first_name,
      user.last_name,
      "\n\n"
    );
    user.pushSubscription = subscription;
    await user.save();

    const payload = JSON.stringify({
      title: "Subscribed!",
      body: "You have successfully subscribed to push notifications!",
    });

    webpush.sendNotification(subscription, payload).catch((error) => {
      console.error("Error sending notification:", error);
    });

    res.sendStatus(200);
  })
);

router.post(
  "/push/test",
  tryCatch(async (req, res) => {
    const user = await User.findById(req.body.userID);
    const subscription = user.pushSubscription;

    const payload = JSON.stringify({
      title: "Test Notification",
      body: "Success!",
    });

    webpush.sendNotification(subscription, payload).catch((error) => {
      console.error("Error sending notification:", error);
    });

    res.sendStatus(200);
  })
);

module.exports = router;
