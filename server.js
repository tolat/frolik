require("dotenv").config();
const express = require("express");
const path = require("path");
const router = express.Router({ mergeParams: true });
const User = require("./models/user");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const { handleCORS } = require("./utils/middleware");

// Set up express
const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "/public/"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(handleCORS);
// Connect to the database and handle connection errors
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
global.db = mongoose.connection;
global.db.on("error", console.error.bind(console, "connection error:"));
global.db.once("open", () => {
  console.log("Main process connected to database");
});

// Session config for express
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 3600 * 24,
    secret: process.env.SECRET,
  }),
  name: "go_session",
  secure: false,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  expires: Date.now() + 1000 * 60 * 60,
};
app.use(session(sessionConfig));

// Morgan logger
const morgan = require("morgan");
app.use(morgan("dev"));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// App Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/activity", require("./routes/activity"))

// All routes go to the client, routing happens on the front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
