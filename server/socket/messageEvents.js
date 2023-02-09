const { Chat } = require('../models/Chat');
const { Message, ChatType } = require('../models/Message');
const { cacheUpdate } = require('./websocket');


const messageCreate = async (user, payload) => {
  if (!payload.chat || !payload.content) return;

  const chat = await Chat.findById(payload.chat);
  if (!chat) throw new Error('Chat not found');

  if (!chat.members.includes(user._id)) throw new Error('You are not a member of this chat');
  const { content } = payload;

  if (content.trim().length < 1) throw new Error('Message is too short');
  if (content.length > 4096) throw new Error('Message is too long');

  const message = new Message({
    type: ChatType.USER,
    author: user._id,
    chat: chat._id,
    content: content.trimEnd(),
  });

  await message.save();
  cacheUpdate({ messages: [{...message.toJSON(), clientSideId: payload._id}] }, chat.members);
}


module.exports = {
  messageCreate
};
