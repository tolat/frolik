const passport = require("passport");
const User = require("../models/user");
const Outing = require("../models/outing");
const Activity = require("../models/activity");
const express = require("express");
const { reqAuthenticated } = require("../utils/middleware");

const router = express.Router({ mergeParams: true });

router.get("/get-all", reqAuthenticated, async (req, res) => {
    const activities = await Activity.find({})
    res.send({activities})
});

module.exports = router;
