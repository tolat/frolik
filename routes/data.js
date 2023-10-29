const Globals = require("../models/globals");
const express = require("express");
const { reqAuthenticated, tryCatch } = require("../utils/middleware");

const router = express.Router({ mergeParams: true });

// Get a photo with given key for user with given id
router.get(
  "/globals",
  tryCatch(async (req, res) => {
    const globals = await Globals.findOne({});

    res.send({ globals });
  })
);

module.exports = router;
