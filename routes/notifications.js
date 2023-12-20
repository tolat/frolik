const router = express.Router({ mergeParams: true });

router.get("/vapid-public-key", (req, res) => {
  res.send({ key: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;
