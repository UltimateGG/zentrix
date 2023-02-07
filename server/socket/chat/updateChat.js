const { Chat } = require('../../models/Chat');
const { cacheUpdate } = require('../websocket');


module.exports = async (user, payload) => {
  if (!payload.id || !payload.title || typeof payload.title !== 'string' || !payload.title.trim()) return;
  if (payload.title.length > 50) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  if (!chat.participants.includes(user.id)) return;

  chat.title = payload.title;
  await chat.save();

  cacheUpdate({ chats: [chat.toJSON()] }, chat.participants);
}
