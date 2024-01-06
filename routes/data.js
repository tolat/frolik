const Globals = require("../models/globals");
const User = require("../models/user");
const Outing = require("../models/outing");
const express = require("express");
const { reqAuthenticated, tryCatch } = require("../utils/middleware");
const { getSignedURLFromS3 } = require("../utils/S3");

const router = express.Router({ mergeParams: true });

// Get globals
router.get(
  "/globals",
  tryCatch(async (req, res) => {
    const globals = await Globals.findOne({});

    res.send({ globals });
  })
);

module.exports = router;
