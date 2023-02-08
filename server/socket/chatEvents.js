const { Chat } = require('../models/Chat');
const { getRandomChatIcon } = require('../models/Chat');
const { cacheUpdate } = require('./websocket');


const createChat = async (user, payload) => {
  const { title, encrypted, password, participants } = payload;

  const newChat = new Chat({
    title,
    iconURL: getRandomChatIcon(),
    encrypted,
    password,
    participants: [...new Set([user.id, ...participants])]
  });
  
  await newChat.save();

  cacheUpdate({ chats: [newChat.toJSON()] }, newChat.participants);
}

const updateChat = async (user, payload) => {
  if (!payload.id || !payload.title || !payload.title.trim() || payload.title.length > 50) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  if (!chat.participants.includes(user.id)) return;

  chat.title = payload.title;
  await chat.save();

  cacheUpdate({ chats: [chat.toJSON()] }, chat.participants);
}

const deleteChat = async (user, payload) => {
  if (!payload.id) return;

  const chat = await Chat.findById(payload.id);
  if (!chat) return;

  await chat.remove();

  cacheUpdate({ deletedChats: [chat._id] }, chat.participants);
}


module.exports = {
  createChat,
  updateChat,
  deleteChat
};
