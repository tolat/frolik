require("dotenv").config();
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router({ mergeParams: true });
const User = require("./models/user");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");

const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "client/build/static/"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
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

// Session
const secret = process.env.SECRET;
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 3600 * 24,
    secret: secret,
  }),
  name: "go_session",
  secure: true,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  expires: Date.now() + 1000 * 60 * 60 * 24,
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

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send({ authenticated: req.isAuthenticated() });
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.get("*", (req, res) => {
  res.send("no path matched");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
