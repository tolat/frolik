const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    outing: { type: Schema.Types.ObjectId, ref: "Outing" },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: String,
    last_read: Object,
    messages: [
      {
        id: String,
        message: String,
        sent: Date,
        user: { type: Schema.Types.ObjectId, ref: "User" },
        // Shared activity: a small snapshot ({_id, name, category, location})
        // so the chat can draw the card without a lookup; the full activity
        // is fetched (GET /activity/:id) when it is opened.
        activity: Object,
      },
    ],
    touched: Date,
  },
  { minimize: false }
);

module.exports = mongoose.model("Chat", ChatSchema);
