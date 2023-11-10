const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OutingSchema = new Schema(
  {
    activity: { type: Schema.Types.ObjectId, ref: "Activity" },
    name: String,
    date_created: Date,
    status: String,
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    date_completed: Date,
    completions: [String],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    invited: [{ type: Schema.Types.ObjectId, ref: "User" }],
    flakes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    photos: [
      { uploader: { type: Schema.Types.ObjectId, ref: "User" }, key: String },
    ],
  },
  { minimize: false }
);

module.exports = mongoose.model("Outing", OutingSchema);
