const { Chat } = require('../models/Chat');


module.exports = async (user, payload) => {
  const chats = await Chat.find({ participants: user._id });
  const json = chats.map((chat) => chat.toJSON());

  return { chats: json };
}
