const { User } = require('../models/User');
const { Chat } = require('../models/Chat');


const cachePopulate = async (user, payload) => {
  const chats = await Chat.find({ members: user._id });
  const allUsers = await User.find({}); // Since this is just me and my friends this is fine to load all

  return {
    chats: chats.map(chat => chat.toJSON()),
    users: allUsers.map(user => user.toJSON()),
  };
}


module.exports = {
  cachePopulate
};
