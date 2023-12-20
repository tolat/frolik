const express = require("express");
const router = express.Router({ mergeParams: true });
const webpush = require("web-push");

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post("/push/subscribe", (req, res) => {
  const subscription = req.body;
  console.log(
    "SUBSCRIPTION:",
    subscription,
    "ENDPOINT: ",
    subscription.endpoint
  );

  const notificationPayload = {
    title: "Notification Title",
    body: "Notification Body",
  };

  webpush
    .sendNotification(subscription, JSON.stringify(notificationPayload))
    .then(() => {
      res.status(200).json({ message: "Notification sent" });
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    });
});

module.exports = router;
