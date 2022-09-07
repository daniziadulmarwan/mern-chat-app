const chats = require("../data");
const Chat = require("../models/chat.model");

module.exports = {
  createChat: async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.sendStatus(400);

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email image",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        return res.status(200).json(fullChat);
      } catch (error) {
        return res.status(400).json(error.message);
      }
    }
  },

  fetchChat: (req, res) => {},

  createChatGroup: async (req, res) => {},
  renameChatGroup: async (req, res) => {},

  addToChatGroup: async (req, res) => {},
  removeFromChatGroup: async (req, res) => {},
};
