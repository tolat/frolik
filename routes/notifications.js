const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post("/push/subscribe", (req, res) => {

  console.log(req.body);
});

module.exports = router;
