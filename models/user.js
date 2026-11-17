const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    tagline: String,
    location: String,
    // Geocoded point for the location label (GeoJSON: [lng, lat])
    location_geo: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], default: undefined },
    },
    reset_token: { expires: Date, hash: String },
    notifications: [Object],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    // Outing chats the user has swiped away into the Archived section
    archived_chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friend_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    outings: [{ type: Schema.Types.ObjectId, ref: "Outing" }],
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    pushSubscription: Object, // legacy single-device subscription
    // One entry per device/browser that enabled notifications
    pushSubscriptions: [Object],
    // Keep location synced to the device's current city on app open
    auto_location: { type: Boolean, default: false },
    // Set once the user has finished (or skipped) the in-app tour
    tour_seen: { type: Boolean, default: false },
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
UserSchema.index({ location_geo: "2dsphere" }, { sparse: true });

UserSchema.virtual("fullname").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("User", UserSchema);
