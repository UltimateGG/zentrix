const { Chat } = require('../models/Chat');
const { getRandomIcon } = require('../models/User');
const { wss, send } = require('./websocket');


module.exports = async (user, payload) => {
  const { title, encrypted, password, participants } = payload;
  const newChat = new Chat({
    title,
    iconURL: getRandomIcon(), // Just use user icons for now
    encrypted,
    password,
    participants: [user._id, ...participants]
  });
  
  await newChat.save();

  newChat.participants.forEach((participant) => {
    const ws = Array.from(wss.clients).find((client) => client.user._id.equals(participant));
    if (ws) send(ws, 'updateCache', { chats: [newChat.toJSON()] });
  });

  return newChat.toJSON();
}
