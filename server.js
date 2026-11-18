require("dotenv").config();

// Prevent MongoDB driver internal errors (auth failures, pool resets, etc.)
// from surfacing as uncaught exceptions that crash the process.
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err.message);
});
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason?.message ?? reason);
});

const express = require("express");
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const webpush = require("web-push");
const { handleCORS } = require("./utils/middleware");
const { attachI18n } = require("./utils/i18n");
const inDev = process.env.NODE_ENV == "development";
const favicon = require("serve-favicon");

// Initialize VAPID keys for web push notifications once at startup.
// Wrapped in try/catch so a missing or malformed key prints a warning
// instead of crashing the entire server process.
try {
  webpush.setVapidDetails(
    `mailto:${process.env.SENDMAIL_FROM}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} catch (err) {
  console.warn(
    "[web-push] VAPID key error — push notifications disabled:",
    err.message
  );
}

// Set up express
const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "/client/build/static"))
);
app.use("/public", express.static(path.join(__dirname, "/client/build/")));
// The built public files at the root too (favicon.ico, manifest.json, app
// icons): index.html links them as /favicon.ico etc., and without this the
// catch-all below answered with index.html, breaking the tab icon, the
// install manifest and the iPhone home-screen icon. index: false keeps "/"
// going to the app.
app.use(express.static(path.join(__dirname, "/client/build/"), { index: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "5mb" }));
app.use(handleCORS);

// Set favicon
app.use(favicon(__dirname + "/public/favicon.ico"));

// Set up socket.io for chat
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");

// Add cors to the socket server if in development
const local = "http://localhost:3000";
const ioConfig = inDev ? { cors: { origin: local, credentials: true } } : {};
const io = socket(server, ioConfig);
module.exports = io;


// Connect to the database and handle connection errors.
// family: 4  → force IPv4 (Node 17+ prefers IPv6 which can break Atlas TLS)
// tls: true  → explicit TLS (required by Atlas)
// tlsAllowInvalidCertificates: controlled by env so dev can set it when needed
global.db = mongoose.connection;
global.db.on("error", (err) =>
  console.error("MongoDB connection error:", err.message)
);
global.db.once("open", () => console.log("Connected to the database"));

// TLS is only forced for Atlas (mongodb+srv) URLs or when DB_TLS=true, so a
// plain local mongod (no TLS) can be used in development.
const useTLS =
  process.env.DB_TLS === "true" || /^mongodb\+srv:/.test(process.env.DB_URL || "");
mongoose
  .connect(process.env.DB_URL, {
    family: 4,
    ...(useTLS ? { tls: true } : {}),
    serverSelectionTimeoutMS: 10000,
  })
  .catch((err) => {
    console.error(
      "MongoDB failed to connect — server will run but DB calls will fail:",
      err.message
    );
  });

// Session config for express
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 3600 * 24,
    secret: process.env.SECRET,
  }),
  name: "go_session",
  secret: process.env.SECRET,
  resave: false,
  // Don't create (and store) a session for every anonymous visitor
  saveUninitialized: false,
  // Cookie options must live under `cookie` — previously `expires` was set at
  // the top level (ignored), so sessions silently became browser-session cookies.
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: !inDev,
    maxAge: parseInt(process.env.SESSION_DURATION) || 7 * 24 * 3600 * 1000,
  },
};
if (!inDev) app.set("trust proxy", 1);
const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);

// Morgan logger
const morgan = require("morgan");
app.use(morgan("dev"));

// Passport
app.use(passport.initialize());
app.use(passport.session());
// req.t(key, vars): server messages in the user's language (utils/i18n.js)
app.use(attachI18n);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Share the express session + passport with socket.io so socket handlers know
// which user is connected (previously sockets were fully unauthenticated).
const onlyForHandshake = (mw) => (req, res, next) =>
  req._query.sid === undefined ? mw(req, res, next) : next();
io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.initialize()));
io.engine.use(onlyForHandshake(passport.session()));
const { onSocketConnection } = require("./utils/utils");
io.on("connection", (socket) => onSocketConnection(socket));

// Serve locally-stored images when running without S3 (STORAGE=local)
const { useLocalStorage, LOCAL_STORAGE_DIR } = require("./utils/S3");
if (useLocalStorage) {
  const { reqAuthenticated } = require("./utils/middleware");
  // Dev-only: DEV_IMAGE_DELAY_MS slows image responses to test loading states
  const imageDelay = inDev ? parseInt(process.env.DEV_IMAGE_DELAY_MS) || 0 : 0;
  app.use(
    "/local-images",
    reqAuthenticated,
    (req, res, next) => (imageDelay ? setTimeout(next, imageDelay) : next()),
    express.static(LOCAL_STORAGE_DIR, {
      setHeaders: (res) => res.setHeader("Content-Type", "image/jpeg"),
    })
  );
  console.log("[storage] Using local image storage in", LOCAL_STORAGE_DIR);
}

// App Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/activity", require("./routes/activity"));
app.use("/data", require("./routes/data"));
app.use("/image", require("./routes/image"));
app.use("/notifications", require("./routes/notifications"));
app.use("/outing", require("./routes/outing"));
app.use("/geo", require("./routes/geo"));

// The service worker must be served from the root so its scope covers every
// page (from /public/ it only controlled /public/*). no-cache so updates ship.
app.get("/service-worker.js", (req, res) => {
  res.set("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "client/build/service-worker.js"));
});

// All routes go to the client, routing happens on the front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
  // Hourly: expire stale invites, boot members who never mark completed,
  // send the 7- and 3-day reminders (utils/outingLifecycle.js)
  require("./utils/outingLifecycle").startStaleOutingJob();
  // Thursday-evening "new matches waiting" push (utils/weeklyNudge.js)
  require("./utils/weeklyNudge").startWeeklyNudgeJob();
});
