const Router = require("express").Router();
const chatController = require("../controllers/chat.controller");

Router.get("/", chatController.index);
Router.get("/:id", chatController.show);

module.exports = Router;
