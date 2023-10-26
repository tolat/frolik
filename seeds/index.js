const denv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const User = require("../models/user");
const Outing = require("../models/outing");
const Globals = require("../models/globals");
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

const removeFileSuffix = (filename) => {
  let newFileName = filename;
  if (!filename.includes(".")) {
    return filename;
  }
  for (let i = filename.length - 1; i >= 0; i--) {
    newFileName = newFileName.slice(0, i);
    if (filename[i] === ".") {
      return newFileName;
    }
  }
};

const deleteAndUploadImagesToS3 = async (directoryPath, duplicate = false) => {
  const files = await fs.readdirSync(directoryPath);

  const deleteAndUpload = async (key, imagePath) => {
    const simpleKey = removeFileSuffix(key);
    console.log("uploading: ", simpleKey);
    // Delete existing images from S3
    await deleteFromS3(process.env.AWS_DEV_BUCKET, simpleKey);

    // Upload image to s3
    const imageBuffer = await fs.readFileSync(imagePath);
    const reducedImageBuffer = await sharp(imageBuffer)
      .resize(280, 280)
      .toBuffer();

    const imageString = reducedImageBuffer.toString("base64");
    await uploadToS3(process.env.AWS_DEV_BUCKET, simpleKey, imageString);
  };

  for (key of files) {
    const imagePath = `${directoryPath}/${key}`;
    // Skip hidden files like .DS_Store and directories
    if (key[0] == "." || !key.includes(".")) {
      continue;
    }

    await deleteAndUpload(key, imagePath);
    if (duplicate) {
      await deleteAndUpload(`dup_${key}`, imagePath);
    }
  }
};

const seedGlobals = async () => {
  const categoryColorMap = {
    Games: "rgb(117, 204, 255)",
    Art: "rgb(186, 255, 169)",
    Sports: "rgb(255, 223, 141)",
    Food: "rgb(255, 194, 156)",
    Adventure: "rgb(255, 158, 166)",
  };

  const statusMap = {
    Ready: "You are available for outing requests from anyone!",
    Busy: "You are busy doing other, less fun things.",
    Searching: "Your status is set to Searching when you are on the 'Go' page.",
    Inactive:
      "Your status will be set to Inactive after two weeks of inactivity.",
  };

  const globals = new Globals({categoryColorMap, statusMap})
  await globals.save()
};

const seedUsers = async () => {
  //Uncomment to Upload seed images to S3
  //const profilePicsPath = `${__dirname}/images`;
  //const sampleImagesPath = `${__dirname}/images/sampleUserPhotos`;
  //await deleteAndUploadImagesToS3(profilePicsPath);
  //await deleteAndUploadImagesToS3(sampleImagesPath, true);

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

    user.profile_picture = {
      key: user.username,
      crop: { x: 0, y: 0 },
      zoom: 1,
    };
    user.photos = [
      "acroyoga",
      "beach",
      "beerpong",
      "drawing",
      "football",
      "icecream",
      "kayaking",
      "lawngame",
      "tenniscourt",
      "dup_acroyoga",
      "dup_beach",
      "dup_beerpong",
      "dup_drawing",
      "dup_football",
      "dup_icecream",
      "dup_kayaking",
      "dup_lawngame",
      "dup_tenniscourt",
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
  await Globals.deleteMany({})
  await seedGlobals()
  console.log('done globals..')

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
