const { Chat } = require('../models/Chat');
const { Message, ChatType } = require('../models/Message');
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

  const chat = await Chat.findById(payload.id).populate('lastMessage');
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
  if (!payload.id || !payload.member) return;

  const add = payload.add;
  const chat = await Chat.findById(payload.id).populate('lastMessage');
  if (!chat || payload.member.toString() === chat.owner.toString()) return;
  if (!add && !chat.members.includes(payload.member)) return;
  if (add && chat.members.includes(payload.member)) return;

  if (add) chat.members.push(payload.member);
  else chat.members = chat.members.filter(m => m.toString() !== payload.member.toString());
  await chat.save();
  
  const systemMessage = new Message({
    type: ChatType.SYSTEM,
    chat: chat._id,
    content: `${user.displayName} ${add ? 'added' : 'removed'} <@${payload.member}> ${add ? 'to ' : 'from'} the chat`,
  });
  
  await systemMessage.save();
  
  cacheUpdate({
    chats: [chat.toJSON()],
    messages: [systemMessage.toJSON()],
  }, chat.members);
}


module.exports = {
  createChat,
  updateChat,
  deleteChat,
  updateMembers,
};
