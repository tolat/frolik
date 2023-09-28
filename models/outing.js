const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OutingSchema = new Schema(
  {
    activity: { type: Schema.Types.ObjectId, ref: "Activity" },
    date: Date,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: String,
    chat: Object,
  },
  { minimize: false }
);

module.exports = mongoose.model("Outing", OutingSchema);
