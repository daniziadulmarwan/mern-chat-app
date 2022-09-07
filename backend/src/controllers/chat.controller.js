const chats = require("../data");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");

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

  fetchChat: (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage", "-password")
        .populate("groupAdmin")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name email image",
          });

          res.status(200).json(results);
        });
    } catch (error) {
      res.statu(400).json(error.message);
    }
  },

  createChatGroup: async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ msg: "Choose the user" });
    }

    let users = JSON.parse(req.body.users);
    if (users.length > 2) {
      return res.status(400).json({ msg: "More than 2 users are required" });
    }

    // masukkan jg user yg sedang login
    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        isGroupChat: true,
        users: users,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },

  renameChatGroup: async (req, res) => {
    const { chatId, chatName } = req.body;
    try {
      const updatedChatName = await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName: chatName,
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(updatedChatName);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },

  addToChatGroup: async (req, res) => {
    const { chatId, userId } = req.body;
    try {
      const addedUserToGroup = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(addedUserToGroup);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },

  removeFromChatGroup: async (req, res) => {
    const { chatId, userId } = req.body;
    try {
      const removedUserFromGroup = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(removedUserFromGroup);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
};
