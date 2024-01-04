const denv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;
const Activity = require("../models/activity");
const User = require("../models/user");
const Outing = require("../models/outing");

console.log(dbUrl);

// Connect to the database and handle connection errors
mongoose.connect(
  "mongodb+srv://appfrolik:FlcC6dqLbYBGuTpS@frolik-production.37vjcty.mongodb.net/frolik-production",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
  console.log("FIXING...");
});

const fix = async () => {
  const outings = await Outing.find({});

  for (let outing of outings) {
    const activity = await Activity.findById(outing.activity);
    if (!activity.outings.find((o) => o.toString() === outing._id.toString())) {
      activity.outings.push(outing);
      await activity.save();
    }
  }

  console.log("DONE");
  process.exit(0);
};

//fix();
