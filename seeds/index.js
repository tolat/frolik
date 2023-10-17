const denv = require("dotenv").config({ path: "./.env" });
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
    await User.register(newUser, "getout1*");
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
    for (let i = 0; i < 4; i++) {
      const outing = new Outing({});
      const filteredUsers = users.filter((u) => u != user);
      let user2 =
        filteredUsers[parseInt((Math.random() * 1000) % filteredUsers.length)];
      outing.activity =
        activities[parseInt((Math.random() * 1000) % activities.length)];
      outing.date_created = new Date();
      outing.date_completed = outing.date_created;
      outing.users = [user, user2];
      outing.status = "Completed";
      outing.chat = {};
      user.outings.push(outing);
      user2.outings.push(outing);

      let user3 = null;
      if (Math.random() > 0.5) {
        user3 = users.filter((u) => u != user && u != user2)[0];
        user3.outings.push(outing);
        outing.users.push(user3)
        await user3.save();
      }

      let user4 = null;
      if (Math.random() > 0.75) {
        user4 = users.filter((u) => u != user && u != user2 && u != user3)[0];
        user4.outings.push(outing);
        outing.users.push(user4)
        await user4.save();
      }

      let user5 = null;
      if (Math.random() > 0.85) {
        user5 = users.filter((u) => u != user && u != user2 && u != user3&& u != user4)[0];
        user5.outings.push(outing);
        outing.users.push(user5)
        await user5.save();
      }

      await outing.save();
      await user.save();
      await user2.save();
    }
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
