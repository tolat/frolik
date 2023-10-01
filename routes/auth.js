const passport=require('passport')
const User = require("../models/user")
const express = require('express')

const router = express.Router({ mergeParams: true });

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (req.isAuthenticated()) {
    res.send({ user });
  }
});

router.post("/check", async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    const user = await User.findOne({ username: req.session.passport.user });
    res.send({ isAuthenticated, user });
  } else {
    res.send({ isAuthenticated });
  }
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.send({ success: true });
  });
});

module.exports = router
