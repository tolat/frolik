require("dotenv").config();
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router({ mergeParams: true });
const User = require("./models/user");

const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "client/build/static/"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

///Helper function for generating auth token. Can move later.

function generateAuthToken(user) {
  // Define the payload (user data) to be included in the token
  const payload = {
    _id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

// Routes

//Login Route
app.post("/login", async (req, res) => {
  console.log("Login route hit");
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If authentication is successful, generate a JWT token and send it in the response
    const token = generateAuthToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.get("*", (req, res) => {
  res.send("no path matched");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
