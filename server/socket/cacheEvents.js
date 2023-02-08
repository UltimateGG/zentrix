const { Chat } = require('../models/Chat');


const cachePopulate = async (user, payload) => {
  const chats = await Chat.find({ participants: user._id });
  const json = chats.map((chat) => chat.toJSON());

  return { chats: json };
}


module.exports = {
  cachePopulate,
};
