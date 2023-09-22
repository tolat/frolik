require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(
  "/static",
  express.static(path.join(__dirname, "client/build/static/"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("*", (req, res) => {
  res.send("no path matched");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
