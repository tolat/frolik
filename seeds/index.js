const denv = require("dotenv").config({ path: './.env' });
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const User = require("../models/user");
const Outing = require("../models/outing");
const dbUrl = process.env.DB_URL;

const { userSeeds } = require("./user");
const { activitySeeds } = require("./activity");

// Connect to the database and handle connection errors
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
  console.log("SEEDING...");
});

const seedUsers = async () => {
  for (user of userSeeds) {
    const newUser = new User({ ...user });
    await User.register(user, "getout1*")
  }

  const users = await User.find();
  for (user of users) {
    for (friend of users) {
      if (user != friend) {
        user.friends.push(friend);
      }
    }
    await user.save();
   
  }
};

const seedActivities = async () => {
  for (activity of activitySeeds) {
    const newActivity = new Activity({ ...activity });
    await newActivity.save();
  }
};

const seedOutings = async () => {
  const users = await User.find();
  const activities = await Activity.find();
  for (user of users) {
    const outing = new Outing({});
    const filteredUsers = users.filter((u) => u != user);
    const user2 =
      filteredUsers[parseInt((Math.random() * 1000) % filteredUsers.length)];
    outing.activity =
      activities[parseInt((Math.random() * 1000) % activities.length)];
    outing.date = new Date();
    outing.users = [user, user2];
    outing.status = "completed";
    outing.chat = {};
    user.outings.push(outing);
    user2.outings.push(outing);

    await outing.save();
    await user.save();
    await user2.save();
  }
};

const seedDB = async () => {
  await User.deleteMany({});
  await seedUsers();
  console.log("done users..");

  await Activity.deleteMany({});
  await seedActivities();
  console.log("done activities..");

  await Outing.deleteMany({});
  await seedOutings();
  console.log("done outings..");
};

const awaitSeed = async () => {
  await seedDB();
  console.log("DONE");
  process.exit(0);
};

awaitSeed();
