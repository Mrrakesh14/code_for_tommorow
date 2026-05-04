const jwt = require("jsonwebtoken");

const middletoken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(401).json("no token create again");

  jwt.verify(token, "Secreatkry", (err, user) => {
    req.user = user;
    next();
  });
};
module.exports = middletoken;
