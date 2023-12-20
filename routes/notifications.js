const express = require("express");
const router = express.Router({ mergeParams: true });
const webpush = require("web-push");

webpush.setVapidDetails(
  `mailto:${process.env.SENDMAIL_FROM}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post("/push/subscribe", (req, res) => {
  const subscription = req.body;

  const payload = JSON.stringify({
    title: "Testing",
    body: "Hope This Works",
  });

  webpush
    .sendNotification(subscription, payload)
    .then(() => {
      console.log("NOTIFICATION SENT");
    })
    .catch((error) => {
      console.log("notification not sent: ", error);
      console.error("Error sending notification:", error);
    });
});

module.exports = router;
