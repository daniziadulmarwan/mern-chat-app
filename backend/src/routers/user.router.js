const userController = require("../controllers/user.controller");
const signin = require("../middlewares/validation/signin.validate");
const signup = require("../middlewares/validation/signup.validate");

const Router = require("express").Router();

Router.post("/signup", signup, userController.signup);
Router.post("/signin", signin, userController.signin);

module.exports = Router;
