const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
  {
    outings: [{ type: Schema.Types.ObjectId, ref: "Outing" }],
    lobby: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: String,
    description: String,
    category: String,
    location: String,
    duration: Number,
    cost: Number,
    participants: Number,
    instructions: [
      {
        kind: String,
        number: Number,
        title: String,
        details: String,
      },
    ],
    ratings: [
      { user: { type: Schema.Types.ObjectId, ref: "User" }, number: Number },
    ],
  },
  { minimize: false }
);

module.exports = mongoose.model("Activity", ActivitySchema);
