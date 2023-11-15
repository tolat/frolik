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

module.exports = io;

// Chat socket logic
io.on("connection", (socket) => {
  try {
    // Message sent handler
    socket.on("message-sent", async (data) => {
      const chat = await Chat.findById(data.chat._id);
      await chat.populate("outing");

      // Only add message if it has not been added
      if (!chat.messages.find((m) => m.id == data.message.id)) {
        chat.messages.unshift(data.message);
        chat.touched = Date.now();

        // Make sure last_read for all users is this message if it is first message
        if (chat.messages.length == 1) {
          console.log("INITIALIZING ALL USERS FOR: ", chat.last_read)
          const chatUsers = chat.outing ? chat.outing.users : chat.users;
          for (let usr of chatUsers) {
            const usrID = usr._id ? usr._id.toString() : usr.toString();
            if (!chat.last_read[usrID]) {
              chat.last_read[usrID] = `${data.message.id}`;
              chat.markModified('last_read')
            }
          }
        }

        console.log("INITIALIZed ALL USERS FOR: ", chat.last_read)

        await chat.save();
        socket.broadcast
          .to(chat._id.toString())
          .emit("new-message", { message: data.message, chat });

        // Send push update to chat users
        pushUserUpdate(chat.outing ? chat.outing.users : chat.users);
      }
    });

    // Join connection to a room
    socket.on("join-room", (room) => {
      socket.join(room);
    });

    // Echo message handler
  } catch (err) {
    console.log(err);
  }
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
const morgan = require("morgan");
const { pushUserUpdate } = require("./utils/utils");
const user = require("./models/user");
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

// All routes go to the client, routing happens on the front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
