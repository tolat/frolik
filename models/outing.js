const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OutingSchema = new Schema(
  {
    activity: { type: Schema.Types.ObjectId, ref: "Activity" },
    name: String,
    date_created: Date,
    created_by:{ type: Schema.Types.ObjectId, ref: "User" },
    date_completed: Date,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    invited: [{ type: Schema.Types.ObjectId, ref: "User" }],
    flakes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: String,
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    photos: [String],
  },
  { minimize: false }
);

module.exports = mongoose.model("Outing", OutingSchema);
