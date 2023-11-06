const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    tagline: String,
    flake: Number,
    location: String,
    notifications: [Object],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    outings: [{ type: Schema.Types.ObjectId, ref: "Outing" }],
    status: {
      updated: Date,
      status: String,
    },
    profile_picture: {
      key: String,
      crop: Object,
      zoom: Number,
    },
    matches: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        updated: Date,
      },
    ],
  },
  { minimize: false }
);

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual("fullname").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("User", UserSchema);
