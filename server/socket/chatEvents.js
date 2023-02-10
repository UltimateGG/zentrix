const { Chat } = require('../models/Chat');
const { Message } = require('../models/Message');
const { getRandomChatIcon } = require('../models/Chat');
const { cacheUpdate } = require('./websocket');


const createChat = async (user, payload) => {
  const { title, encrypted, password, members } = payload;

  const newChat = new Chat({
    owner: user._id,
    title,
    iconURL: getRandomChatIcon(),
    encrypted,
    password,
    members: [...new Set([user.id, ...members])]
  });
  
  await newChat.save();

  cacheUpdate({ chats: [newChat.toJSON()] }, newChat.members);
}

const updateChat = async (user, payload) => {
  if (!payload.id || !payload.title || !payload.title.trim() || payload.title.length > 50) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  if (!chat.members.includes(user.id)) return;

  chat.title = payload.title;
  await chat.save();

  cacheUpdate({ chats: [chat.toJSON()] }, chat.members);
}

const deleteChat = async (user, payload) => {
  if (!payload.id) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;
  if (chat.owner.toString() !== user.id) return;

  await chat.remove();
  await Message.deleteMany({ chat: chat._id });

  cacheUpdate({ chats: [{ ...chat.toJSON(), members: [] }] }, chat.members);
}

const updateMembers = async (user, payload) => {
  if (!payload.id || !payload.members) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  if (!chat.members.includes(user.id)) return;
  if (!payload.members.includes(chat.owner.toString())) return;

  const oldMembers = [...chat.members];
  chat.members = [...new Set([user.id, ...payload.members])];
  await chat.save();

  const sendTo = [...new Set([...oldMembers, ...chat.members])];
  cacheUpdate({ chats: [chat.toJSON()] }, sendTo);
}


module.exports = {
  createChat,
  updateChat,
  deleteChat,
  updateMembers,
};
