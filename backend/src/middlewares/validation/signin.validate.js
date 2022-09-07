const { body, validationResult } = require("express-validator");
const User = require("../../models/user.model");

const signin = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Email must be an email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) return Promise.reject("User not found");
      return true;
    }),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    next();
  },
];

module.exports = signin;
