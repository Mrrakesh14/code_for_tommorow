const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const verifiedtoken = require("./middleware/middleware");
app.use("/api/auth", require("./routes/authent"));
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyparser());
mongoose
  .connect(process.env.mongo_url)
  .then(() => consol.log("mongodb conected"))
  .catch((err) => console.log("err"));

app.get("/api", verifiedtoken, (req, res) => {
  res.json("middleware authentivation token");
});

app.listen(process.env.port, () => {
  console.log("server running on port ${process.env.port}");
});
