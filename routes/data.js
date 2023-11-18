const Globals = require("../models/globals");
const User = require("../models/user");
const Outing = require("../models/outing");
const express = require("express");
const {
  reqAuthenticated,
  tryCatch,
  sameUserOnly,
} = require("../utils/middleware");
const { downloadFromS3 } = require("../utils/S3");

const router = express.Router({ mergeParams: true });

// Get globals
router.get(
  "/globals",
  tryCatch(async (req, res) => {
    const globals = await Globals.findOne({});

    res.send({ globals });
  })
);

// Get a photo from an outing with given key
router.get(
  "/outing/:outingid/photo/:key",
  reqAuthenticated,
  tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const outing = await Outing.findById(req.params.outingid);

    // Return unacceptable if photo is not in outing
    if (!outing.photos.find((p) => p.key == req.params.key)) {
      res.status(406).send({
        message: `photo with key ${
          req.params.key
        } not found in outing ${outing._id.toString()}`,
      });
      return;
    }

    // Download image stream from S3 and pipe into response
    downloadFromS3(process.env.AWS_BUCKET, req.params.key)
      .then((imageStream) => imageStream.pipe(res))
      .catch((error) => {
        console.error("Error downloading image:", error);
        res.status(500).send("Internal Server Error");
      });
  })
);

module.exports = router;
