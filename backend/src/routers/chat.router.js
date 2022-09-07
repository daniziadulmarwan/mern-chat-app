const Router = require("express").Router();
const chatController = require("../controllers/chat.controller");
const auth = require("../middlewares/auth");

Router.use(auth);

Router.get("/", chatController.fetchChat);
Router.post("/", chatController.createChat);

Router.post("/group", chatController.createChatGroup);
Router.put("/rename", chatController.renameChatGroup);

Router.put("/addgroup", chatController.addToChatGroup);
Router.put("/removegroup", chatController.removeFromChatGroup);

module.exports = Router;
