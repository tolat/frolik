const User = require("../models/user")

module.exports.handleCORS = async (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000"
      : process.env.server
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  // Send success if CORS checks options on pre-flight test
  "OPTIONS" == req.method ? res.sendStatus(200) : next();
};

module.exports.reqAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports.sameUserOnly = async (req, res, next) => {
  // Check if the request is authenticated
  if (req.isAuthenticated()) {
    const user = await User.findOne({ username: req.session?.passport?.user });

    // Send not found if no user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Only move along if the request params id is the same as the
    // id for the session user
    if (user._id.toString() !== req.params.id) {
      res.status(401).send("Not Authorized");
    } else {
      req.user = user
      next();
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports.logIncoming = (req, res, next) => {
  console.log(req.body);
  next();
};

module.exports.tryCatch = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
};
