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

module.exports.logIncoming = (req,res,next) =>{
  console.log(req.body);
  next()
}
