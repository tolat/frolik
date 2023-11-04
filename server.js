require("dotenv").config();
const express = require("express");
const path = require("path");
const User = require("./models/user");
const Chat = require("./models/chat");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors"); // Add this line
const inDevelopment = process.env.NODE_ENV == "development";
const { handleCORS } = require("./utils/middleware");

// Set up express
const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "/client/build/static"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(handleCORS);

// Set up socket.io for chat
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");

// Add cors to the socket server if in development
const io = inDevelopment
  ? socket(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: "include",
      },
    })
  : socket(server);

// Chat socket logic
io.on("connection", (socket) => {
  // Message sent handler
  socket.on("message-sent", async (data) => {
    const chat = await Chat.findById(data.chat._id);

    console.log('New message sent!')

    // Only add message if it has not bed added
    if (!chat.messages.find((m) => m.id == data.message.id)) {
      chat.messages.unshift(data.message);
      chat.touched = Date.now();
      await chat.save();
      socket.broadcast
        .to(data.chat._id)
        .emit("new-message", { message: data.message, chat });
    }
  });

  // Join connection to a room
  socket.on("join-room", (room) => {
    socket.join(room);
  });

  // Echo message handler
});

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
//const morgan = require("morgan");
//app.use(morgan("dev"));

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

// All routes go to the client, routing happens on the front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
