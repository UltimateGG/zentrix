const { Chat } = require('../models/Chat');
const { getRandomChatIcon } = require('../models/Chat');
const { cacheUpdate } = require('./websocket');


const createChat = async (user, payload) => {
  const { title, encrypted, password, members } = payload;

  const newChat = new Chat({
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

  await chat.remove();

  cacheUpdate({ chats: [{ ...chat.toJSON(), members: [] }] }, chat.members);
}

const updateMembers = async (user, payload) => {
  if (!payload.id || !payload.members) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  if (!chat.members.includes(user.id)) return;

  const oldMembers = [...chat.members].map(id => id.toString());
  chat.members = [...new Set([user.id, ...payload.members])];
  await chat.save();

  const sendTo = [...new Set([...oldMembers, ...chat.members.map(id => id.toString())])];
  cacheUpdate({ chats: [chat.toJSON()] }, sendTo);
}


module.exports = {
  createChat,
  updateChat,
  deleteChat,
  updateMembers,
};
