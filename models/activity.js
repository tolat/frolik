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
    goal: "String",
    featured: Boolean,
    instructions: [
      {
        kind: String,
        number: Number,
        title: String,
        details: String,
      },
    ],
    ratings: [
      { user: { type: Schema.Types.ObjectId, ref: "User" }, rating: Number },
    ],
    media: Object,
  },
  { minimize: false }
);

// Virtual for calculating average rating
ActivitySchema.virtual("rating").get(function () {
  return (
    this.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
    this.ratings.length
  );
});

module.exports = mongoose.model("Activity", ActivitySchema);
