const denv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const User = require("../models/user");
const Outing = require("../models/outing");
const Globals = require("../models/globals");
const dbUrl = process.env.DB_URL;
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const { userSeeds, userSeeds2 } = require("./user");
const { activitySeeds } = require("./activity");
const { uploadToS3, deleteFromS3, deleteAllFromS3 } = require("../utils/S3");

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

const UploadImagesToS3 = async (directoryPath) => {
  const files = await fs.readdirSync(directoryPath);

  const uploadImage = async (key, imagePath) => {
    const simpleKey = removeFileSuffix(key);
    console.log("uploading: ", simpleKey);

    // Upload image to s3
    const imageBuffer = await fs.readFileSync(imagePath);
    const reducedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 70 })
      .toBuffer();

    const imageString = reducedImageBuffer.toString("base64");
    await uploadToS3(process.env.AWS_BUCKET, simpleKey, imageString);
  };

  for (key of files) {
    const imagePath = `${directoryPath}/${key}`;
    // Skip hidden files like .DS_Store and directories
    if (key[0] == "." || !key.includes(".")) {
      continue;
    }

    await uploadImage(key, imagePath);
  }
};

const seedGlobals = async () => {
  const categoryColorMap = {
    Games: "rgb(117, 204, 255)",
    Art: "rgb(186, 255, 169)",
    Sports: "rgb(255 236 69)",
    Food: "rgb(238 183 220)",
    Adventure: "rgb(248 157 157)",
  };

  const statusMap = {
    Ready: "You are available for outing requests from anyone!",
    Busy: "You are busy doing other, less fun things.",
    Searching: "Your status is set to Searching when you are on the 'Go' page.",
    Inactive:
      "Your status will be set to Inactive after two weeks of inactivity.",
  };

  // Load city data
  const cityDataPath = path.join(__dirname, "/city-data/cities10000.json");
  const readCityData = new Promise((resolve, reject) => {
    fs.readFile(cityDataPath, "utf8", async (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        reject();
        return;
      }

      const filteredData = JSON.parse(data).map((city) => {
        return {
          name: city.name,
          country: city.country_code,
          timezone: city.timezone,
        };
      });
      resolve(filteredData);
    });
  });
  const cityData = await readCityData;

  const globals = new Globals({ categoryColorMap, statusMap, cityData });
  await globals.save();
};

const seedUsers = async () => {
  // Delete sampledev bucket data and re-seed images
  // await deleteAllFromS3(process.env.AWS_BUCKET);
  // const profilePicsPath = `${__dirname}/images`;
  // const sampleImagesPath = `${__dirname}/images/sampleUserPhotos`;
  // await UploadImagesToS3(profilePicsPath);
  // await UploadImagesToS3(sampleImagesPath);

  // Create users
  async function createUsers(seeds) {
    for (user of seeds) {
      const newUser = new User({ ...user });
      await User.register(newUser, "getout1*");
    }

    const seedUsernames = seeds.map(u=> u.username)
    const users = await User.find({username: {$in: seedUsernames}});
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

      await user.save();
    }
  }

  await createUsers(userSeeds);
  await createUsers(userSeeds2);
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

const seedOutings = async (seeds) => {
  const seedUsernames = seeds.map((u) => u.username);
  const users = await User.find({ username: { $in: seedUsernames } });
  let activities = await Activity.find();

  //Remove one activity at random from the activities list
  activities.splice((Math.random() * 1000) % activities.length, 1);

  let outingPhotoKeys = [
    "acroyoga",
    "beach",
    "beerpong",
    "drawing",
    "football",
    "icecream",
    "kayaking",
    "lawngame",
    "tenniscourt",
    "beachglass",
  ];

  for (user of users) {
    for (let i = 0; i < 2; i++) {
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
      outing.photos.push(outingPhotoKeys.pop());
      user.outings.push(outing);
      user2.outings.push(outing);
      await user.save();
      await user2.save();

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
    }
  }
};

const seedDB = async () => {
  await Globals.deleteMany({});
  await seedGlobals();
  console.log("done globals..");

  await User.deleteMany({});
  await seedUsers();
  console.log("done users..");

  await Activity.deleteMany({});
  await seedActivities();
  console.log("done activities..");

  await Outing.deleteMany({});
  await seedOutings(userSeeds);
  await seedOutings(userSeeds2);
  console.log("done outings..");
};

const awaitSeed = async () => {
  await seedDB();
  console.log("DONE");
  process.exit(0);
};

awaitSeed();
