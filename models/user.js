const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    tagline: String,
    status: {
      updated: Date,
      status: String,
    },
    profile_picture: {
      key: String,
      crop: Object,
      zoom: Number,
    },
    flake: Number,
    location: String,
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    outings: [{ type: Schema.Types.ObjectId, ref: "Outing" }],
  },
  { minimize: false }
);

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual("fullname").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("User", UserSchema);
