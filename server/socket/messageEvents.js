const { Chat } = require('../models/Chat');
const { Message, ChatType } = require('../models/Message');
const { cacheUpdate } = require('./websocket');


const MAX_MESSAGE_LENGTH = 4096;

const messageCreate = async (user, payload) => {
  if (!payload.chat || !payload.content) return;

  const chat = await Chat.findById(payload.chat);
  if (!chat) throw new Error('Chat not found');

  if (!chat.members.includes(user._id)) throw new Error('You are not a member of this chat');
  const { content } = payload;

  if (content.trim().length < 1) throw new Error('Message is too short');
  if (content.length > MAX_MESSAGE_LENGTH) throw new Error('Message is too long');

  const message = new Message({
    type: ChatType.USER,
    author: user._id,
    chat: chat._id,
    content: content.trimEnd(),
  });

  await message.save();

  cacheUpdate({ messages: [{...message.toJSON(), clientSideId: payload._id}] }, chat.members);
}

const loadAmount = 50;
const getMessages = async (user, payload) => {
  if (!payload.chat || !payload.before || isNaN(Number(payload.before))) return;

  const chat = await Chat.findById(payload.chat);
  if (!chat) throw new Error('Chat not found');

  if (!chat.members.includes(user._id)) throw new Error('You are not a member of this chat');

  const messages = await Message.find({ chat: chat._id, createdAt: { $lt: payload.before } }).sort({ createdAt: -1 }).limit(loadAmount);

  cacheUpdate({ messages: messages.map(m => m.toJSON()) }, [user.id]);
  if (messages.length < loadAmount) return { end: true };
}

const messageDelete = async (user, payload) => {
  if (!payload.id) return;

  const message = await Message.findById(payload.id);
  if (!message || message.author.toString() !== user._id.toString()) return;

  const chat = await Chat.findById(message.chat);
  if (!chat) return;

  await message.delete();
  cacheUpdate({ messages: [{ _id: message._id, chat: chat._id, deleted: true }] }, chat.members);
}

const messageUpdate = async (user, payload) => {
  const { id, content } = payload;
  if (!id || !content) return;

  const message = await Message.findById(id);
  if (!message || message.author.toString() !== user._id.toString()) return;

  const chat = await Chat.findById(message.chat);
  if (!chat || !chat.members.includes(user._id)) return;

  if (content.trim().length < 1) throw new Error('Message is too short');
  if (content.length > MAX_MESSAGE_LENGTH) throw new Error('Message is too long');

  message.content = content.trimEnd();
  message.editedAt = Date.now();
  await message.save();

  cacheUpdate({ messages: [message.toJSON()] }, chat.members);
}


module.exports = {
  messageCreate,
  getMessages,
  messageDelete,
  messageUpdate,
};
