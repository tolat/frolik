const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    outing: { type: Schema.Types.ObjectId, ref: "Outing" },
    name: String,
    messages: [
      {
        id: String,
        message: String,
        sent: Date,
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    touched: Date,
  },
  { minimize: false }
);

module.exports = mongoose.model("Chat", ChatSchema);
