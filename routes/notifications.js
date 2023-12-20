const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post("/push/subscribe", (req, res) => {
  const subscription = JSON.parse(req.body);
  console.log(subscription);
});

module.exports = router;
