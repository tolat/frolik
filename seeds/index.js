const denv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const User = require("../models/user");
const Outing = require("../models/outing");
const dbUrl = process.env.DB_URL;
const fs = require("fs");
const sharp = require("sharp");

const { userSeeds } = require("./user");
const { activitySeeds } = require("./activity");
const { uploadToS3, deleteFromS3 } = require("../utils/S3");

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

const deleteAndUploadImagesToS3 = async (directoryPath) => {
  const files = await fs.readdirSync(directoryPath);
  for (key of files) {
    const imagePath = `${directoryPath}/${key}`;
    // Skip hidden files like .DS_Store and directories
    if (key[0] == "." || !key.includes(".")) {
      continue;
    }
    console.log("uploading: ", key);
    // Delete existing images from S3
    await deleteFromS3(process.env.AWS_DEV_BUCKET, key);

    // Upload image to s3
    const sampleImageBuffer = await fs.readFileSync(imagePath);
    const resizedBuffer = await sharp(sampleImageBuffer)
      .resize(350, 350)
      .toBuffer();
    await uploadToS3(process.env.AWS_DEV_BUCKET, key, resizedBuffer);
  }
};

const seedUsers = async () => {
  console.log("** USING EXISITNG IMAGES **");
  // Upload seed images to S3
  // const profilePicsPath = `${__dirname}/images`;
  // const sampleImagesPath = `${__dirname}/images/sampleUserPhotos`;
  // await deleteAndUploadImagesToS3(profilePicsPath);
  // await deleteAndUploadImagesToS3(sampleImagesPath);

  // Create users
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

    user.profile_picture = `${user.first_name}.jpeg`.toLowerCase();
    user.photos = [
      "acroyoga.png",
      "beach.png",
      "beerpong.png",
      "drawing.png",
      "football.png",
      "icecream.png",
      "kayaking.png",
      "lawngame.png",
      "tenniscourt.png",
    ];
    await user.save();
  }
};

const seedActivities = async () => {
  for (activity of activitySeeds) {
    const newActivity = new Activity({ ...activity });
    const seedUsers = await User.find({});

    for (u of seedUsers) {
      newActivity.ratings.push({
        user: u,
        rating: parseInt((Math.random() * 10) % 5),
      });
    }

    newActivity.markModified("ratings");
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
        outing.users.push(user3);
        await user3.save();
      }

      let user4 = null;
      if (Math.random() > 0.75) {
        user4 = users.filter((u) => u != user && u != user2 && u != user3)[0];
        user4.outings.push(outing);
        outing.users.push(user4);
        await user4.save();
      }

      let user5 = null;
      if (Math.random() > 0.85) {
        user5 = users.filter(
          (u) => u != user && u != user2 && u != user3 && u != user4
        )[0];
        user5.outings.push(outing);
        outing.users.push(user5);
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
