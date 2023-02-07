const { Chat } = require('../../models/Chat');
const { getRandomIcon } = require('../../models/User');
const { cacheUpdate } = require('../websocket');


module.exports = async (user, payload) => {
  const { title, encrypted, password, participants } = payload;

  const newChat = new Chat({
    title,
    iconURL: getRandomIcon(),
    encrypted,
    password,
    participants: [...new Set([user.id, ...participants])]
  });
  
  await newChat.save();

  cacheUpdate({ chats: [newChat.toJSON()] }, newChat.participants);
}
