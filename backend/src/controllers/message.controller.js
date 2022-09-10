const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

module.exports = {
  async sendMessage(req, res) {
    const { content, chatId } = req.body;
    if (!content || !chatId) return res.status(400).json("Required");
    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    try {
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name image");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name image email",
      });
      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      return res.status(200).json(message);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async allMessages(req, res) {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name image email")
        .populate("chat");
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};
