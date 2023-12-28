require("dotenv").config();
const User = require("../models/user");
const Chat = require("../models/chat");
const webpush = require("web-push"); // Add this line for web-push
const inDevelopment = process.env.NODE_ENV == "development";
const { pushUserUpdate, webpushNotify } = require("../utils/utils");

module.exports.init = (app) => {
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

  // Set up VAPID keys (replace 'your-public-key' with your actual VAPID public key)
  webpush.setVapidDetails(
    `mailto:${process.env.SENDMAIL_FROM}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

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

          // Make sure last_read for all users is this message if it is the first message
          if (chat.messages.length == 1) {
            const chatUsers = chat.outing ? chat.outing.users : chat.users;
            for (let usr of chatUsers) {
              const usrID = usr._id ? usr._id.toString() : usr.toString();
              if (!chat.last_read[usrID]) {
                chat.last_read[usrID] = "initialized";
                chat.markModified("last_read");
              }
            }
          }
          await chat.save();

          socket.broadcast
            .to(chat._id.toString())
            .emit("new-message", { message: data.message, chat });

          let chatUsers = chat.outing ? chat.outing.users : chat.users;
          // Send websocket update to client to re-download session user from server
          pushUserUpdate(chatUsers);

          // Send webpush notification to all users other than sending user
          const sender = await User.findById(
            data.message.user._id
              ? data.message.user._id.toString()
              : data.message.user.toString()
          );
          const payload = {
            title: `${sender.first_name} ${sender.last_name} to ${
              chat.outing ? chat.outing.name : "Chat"
            }`,
            body: data.message.message,
          };
          webpushNotify(
            // Filter sender out of chat users list for notification sending
            chatUsers.filter((u) => {
              if (u._id) {
                return u._id.toString() !== sender._id.toString();
              } else {
                return u.toString() !== sender._id.toString();
              }
            }),
            payload
          );
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

  return [server, io];
};
