const denv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const User = require("../models/user");
const Outing = require("../models/outing");
const Globals = require("../models/globals");
const Chat = require("../models/chat");

const dbUrl = process.env.DB_URL;
const fs = require("fs");
const sharp = require("sharp");

const { userSeeds, userSeeds2, userSeeds3 } = require("./user");
const { activitySeeds } = require("./activity");
const { uploadToS3, deleteFromS3, deleteAllFromS3 } = require("../utils/S3");
const { generateUniqueName } = require("../utils/utils");
const { categoryColorMap, statusMap, instructionTypes } = require("./globals");

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
      .jpeg({ quality: 60 })
      .toBuffer();

    await uploadToS3(process.env.AWS_BUCKET, simpleKey, reducedImageBuffer);
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
  const globals = new Globals({ categoryColorMap, statusMap, instructionTypes });
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

    const seedUsernames = seeds.map((u) => u.username);
    const users = await User.find({ username: { $in: seedUsernames } });
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

      user.chats = [];

      await user.save();
    }
  }

  await createUsers(userSeeds);
  await createUsers(userSeeds2);
  await createUsers(userSeeds3);
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
    "jenga",
    "beerpong",
    "drawing",
    "football",
    "icecream",
    "kayaking",
    "soccer",
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
      const photoCount = Math.floor((Math.random() * 10) % 6) + 1;
      const outingPhotoKeysCopy = [...outingPhotoKeys];
      for (let i = 0; i < photoCount; i++) {
        const randomIndex = Math.floor(
          (Math.random() * 10) % outingPhotoKeysCopy.length
        );

        outing.photos.push({
          uploader: user,
          key: outingPhotoKeysCopy[randomIndex],
        });
        outingPhotoKeysCopy.splice(randomIndex, 1);
      }

      outing.name = generateUniqueName();

      user.outings.push(outing);
      user2.outings.push(outing);
      await user.save();
      await user2.save();

      outing.completions.push(user, user2);

      let user3 = null;
      if (Math.random() > 0.5) {
        user3 = users.filter((u) => u != user && u != user2)[0];
        user3.outings.push(outing);
        outing.users.push(user3);
        await user3.save();
        outing.completions.push(user3);
      }

      let user4 = null;
      if (Math.random() > 0.75) {
        user4 = users.filter((u) => u != user && u != user2 && u != user3)[0];
        user4.outings.push(outing);
        outing.users.push(user4);
        await user4.save();
        outing.completions.push(user4);
      }

      let user5 = null;
      if (Math.random() > 0.85) {
        user5 = users.filter(
          (u) => u != user && u != user2 && u != user3 && u != user4
        )[0];
        user5.outings.push(outing);
        outing.users.push(user5);
        await user5.save();
        outing.completions.push(user5);
      }

      await outing.save();
    }
  }
};

const seedChats = async () => {
  const allOutings = await Outing.find({});

  for (outing of allOutings) {
    await outing.populate("users");
    await outing.populate("activity");

    // Create chat for this outing
    let chat = new Chat({
      name: outing.name,
      outing,
      last_read: {},
      messages: [
        {
          id: Date.now() + Math.random(),
          message: "Hey, how's it going?",
          sent: Date.now() - 1000000,
          user: outing.users[0],
        },
        {
          id: Date.now() + Math.random(),
          message: "Pretty good, ready for our adventure?!",
          sent: Date.now() - 5000000,
          user: outing.users[1],
        },
      ],
      touched: Date.now(),
    });

    if (outing.users[2]) {
      chat.messages.push({
        id: Date.now() + Math.random(),
        message:
          "Stoked! Where should we meet? This will be fun, I've never user this app before.",
        sent: Date.now() - 10000000,
        user: outing.users[2],
      });
    }

    // Add chat to chats list for all outing users
    for (user of outing.users) {
      chat.last_read[user._id.toString()] = chat.messages[0].id;
      if (!user.chats) {
        user.chats = [];
      }
      user.chats.push(chat);
      await user.save();
    }

    await chat.save();

    // set chat as the chat for this outing
    outing.chat = chat;
    await outing.save();
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
  await seedOutings(userSeeds3);
  console.log("done outings..");

  await Chat.deleteMany({});
  await seedChats();
  console.log("done chats..");
};

const awaitSeed = async () => {
  await seedDB();
  console.log("DONE");
  process.exit(0);
};

awaitSeed();
