const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const signin = require("../middlewares/validation/signin.validate");
const signup = require("../middlewares/validation/signup.validate");

const Router = require("express").Router();

Router.post("/signup", signup, userController.signup);
Router.post("/signin", signin, userController.signin);
Router.get("/", auth, userController.fetchAll);

module.exports = Router;
