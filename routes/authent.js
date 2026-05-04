const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const router = express.Router();

const generatetoken = (user) => {
  return jwt.sign({ id: user._id }, "Secreatkry", { expiresIn: "1m" });
};
const genrefreshtoken = (user) => {
  return jwt.sign({ id: user._id }, "Secreatkry", { expiresIn: "7d" });
};

//register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = User.findOne("email");
    if (user) return res.status(201).send("user already exist");

    const hashpassword = await bcrypt.hash(password, 10);
    user = await User.create({
      email,
      password: hashpassword,
    });
    res.json({ message: "user register sussesfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("user not found");
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) return res.status(401).send("wrong password");
    const acctoken = generatetoken(user);
    const reftoken = genrefreshtoken(user);
    user.reftoken = reftoken;
    await user.save();
    res.json({
      acctoken,
      reftoken,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//newtoken
router.post("/refresh", async (req, res) => {
  const { reftoken } = req.body;
  if (!reftoken) return res.status(401).json("Invalid token");
  const user = await User.findOne({ reftoken });
  if (!user) return res.status(401).json("Invalid token");
  jwt.verify(reftoken, "Secreatkry", (err, data) => {
    if (err) return res.status(401).json(" token expired");
    const newtoken = generatetoken(user);
    res.json({ currtoken: newtoken });
  });
});
module.exports = router;
