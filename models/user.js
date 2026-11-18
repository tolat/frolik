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
    // Chats this user deleted "for me": when they did it. The chat stays for
    // everyone else; if a new message arrives it comes back for this user,
    // showing only messages after `at` (routes/user.js chat routes)
    cleared_chats: [
      {
        chat: { type: Schema.Types.ObjectId, ref: "Chat" },
        at: Date,
      },
    ],
    // Outing chats the user has swiped away into the Archived section
    archived_chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friend_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // People this user was friends with and then unfriended (either side).
    // Re-friending needs them to come up in daily matches again
    // (`rematched`) and a new Outing completed together after that.
    former_friends: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        removed: Date,
        rematched: Date,
      },
    ],
    outings: [{ type: Schema.Types.ObjectId, ref: "Outing" }],
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    pushSubscription: Object, // legacy single-device subscription
    // One entry per device/browser that enabled notifications
    pushSubscriptions: [Object],
    // Keep location synced to the device's current city on app open
    auto_location: { type: Boolean, default: false },
    // Interface language (utils/i18n.js LANGS); emails and pushes use it too
    language: { type: String, default: "en" },
    // Week each weekly push was last sent, e.g. { matches: "2026-W47",
    // friends: "2026-W47" } (utils/weeklyNudge.js)
    weekly_nudges: { matches: String, friends: String },
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
