const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OutingSchema = new Schema(
  {
    activity: { type: Schema.Types.ObjectId, ref: "Activity" },
    date_crated: Date,
    date_completed: Date,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: String,
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    photos: [String],
  },
  { minimize: false }
);

module.exports = mongoose.model("Outing", OutingSchema);
