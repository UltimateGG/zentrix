const { Chat } = require('../models/Chat');
const { User } = require('../models/User');


const cachePopulate = async (user, payload) => {
  const chats = await Chat.find({ participants: user._id });
  const json = chats.map((chat) => chat.toJSON());

  return { chats: json };
}

const getUsers = async (user, payload) => {
  const ids = payload.ids;

  const users = await User.find({ _id: { $in: ids } });
  const json = users.map((user) => user.toJSON());

  return { users: json };
}


module.exports = {
  cachePopulate,
  getUsers,
};
