const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

module.exports = {
  signup: asyncHandler(async (req, res) => {
    try {
      const { name, email, password, image } = req.body;

      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        image,
      });

      // const data = {
      //   id: user._id,
      //   name: user.name,
      //   image: user.image,
      //   email: user.email,
      // };

      // const KEY = process.env.KEY;
      // const token = await jwt.sign(data, KEY, { expiresIn: "1d" });

      return res.status(201).json({ user });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }),

  signin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      const matchedPassword = bcrypt.compareSync(password, user.password);
      if (!matchedPassword) return res.status(403).json("Wrong password");
      const data = {
        id: user._id,
        name: user.name,
        image: user.image,
        email: user.email,
      };
      const KEY = process.env.KEY;
      const token = await jwt.sign(data, KEY, { expiresIn: "1d" });
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  fetchAll: async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "-i" } },
            { email: { $regex: req.query.search, $options: "-i" } },
          ],
        }
      : {};

    const users = await User.find(keyword)
      .find({
        _id: { $ne: req.user._id.toString() },
      })
      .select("-password");
    return res.status(200).json({ users });
  },
};
