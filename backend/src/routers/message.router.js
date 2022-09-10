const Router = require("express").Router();
const messageController = require("../controllers/message.controller");
const auth = require("../middlewares/auth");

Router.use(auth);
Router.post("/", messageController.sendMessage);
Router.get("/:chatId", messageController.allMessages);

module.exports = Router;
