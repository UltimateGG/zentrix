const { Chat } = require('../../models/Chat');
const { cacheUpdate } = require('../websocket');


module.exports = async (user, payload) => {
  if (!payload.id) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  await chat.remove();

  cacheUpdate({ deletedChats: [chat._id] }, chat.participants);
}
