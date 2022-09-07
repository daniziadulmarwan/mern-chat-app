const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function auth(req, res, next) {
  if (!req.headers.authorization.split(" ")[1]) return res.sendStatus(401);
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.sendStatus(403);

  const decode = await jwt.verify(token, process.env.KEY);
  const user = await User.findById(decode.id).select("-password");
  if (!user) return res.sendStatus(403);

  req.user = user;
  next();
}

module.exports = auth;
