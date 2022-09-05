const chats = require("../data");

module.exports = {
  index: (req, res) => {
    res.send(chats);
  },

  show: (req, res) => {
    const chat = chats.find((v) => v._id === req.params.id);
    res.send(chat);
  },
};
