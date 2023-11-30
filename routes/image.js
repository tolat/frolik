const Globals = require("../models/globals");
const User = require("../models/user");
const Outing = require("../models/outing");
const express = require("express");
const { reqAuthenticated, tryCatch } = require("../utils/middleware");
const path = require("path");

const router = express.Router({ mergeParams: true });

router.get("/bell-icon", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/images/bell-light.png"));
});

router.get("/chat-icon", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/images/chat-light.png"));
});

module.exports = router;
