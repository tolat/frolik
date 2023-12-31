require("dotenv").config();
const express = require("express");
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const { handleCORS } = require("./utils/middleware");
const inDev = process.env.NODE_ENV == "development";
const favicon = require("serve-favicon");

// Set up express
const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "/client/build/static"))
);
app.use("/public", express.static(path.join(__dirname, "/client/build/")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(handleCORS);

// Set favicon
app.use(favicon(__dirname + "/public/favicon.ico"));

// Set up socket.io for chat
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");

// Add cors to the socket server if in development
const local = "http://localhost:3000";
const ioConfig = inDev ? { origin: local, credentials: "include" } : {};
const io = socket(server, ioConfig);
module.exports = io;

// Chat socket logic
io.on("connection", (socket) => onSocketConnection(socket));
const { onSocketConnection } = require("./utils/utils");

// Connect to the database and handle connection errors
try {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  global.db = mongoose.connection;
  global.db.on("error", console.error.bind(console, "connection error:"));
  global.db.once("open", () => {
    console.log("Main process connected to the database");
  });
} catch (e) {
  console.log(e);
}

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
  expires: Date.now() + process.env.SESSION_DURATION,
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
app.use("/activity", require("./routes/activity"));
app.use("/data", require("./routes/data"));
app.use("/image", require("./routes/image"));
app.use("/notifications", require("./routes/notifications"));
app.use("/outing", require("./routes/outing"));

// All routes go to the client, routing happens on the front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
