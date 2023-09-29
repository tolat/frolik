module.exports.handleCORS = async (req, res, next) => {
  // allow requests from http version of secure origin
  let server = process.env.SERVER;

  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", server);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  // Send success if CORS checks options on pre-flight test
  "OPTIONS" == req.method ? res.send(200) : next();
};

module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    console.log("\n\n\nNOT AUTHENTICATED \n\n\n");
    return res.redirect("/login");
  }
  next();
};
