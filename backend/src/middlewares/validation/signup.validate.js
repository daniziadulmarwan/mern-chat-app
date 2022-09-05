const { body, validationResult } = require("express-validator");
const User = require("../../models/user.model");

const signup = [
  body("name").notEmpty(),
  body("email")
    .notEmpty()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) return Promise.reject("User registered");
      return true;
    }),
  body("password").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    next();
  },
];

module.exports = signup;
