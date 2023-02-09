const WSServer = require('ws').Server;
const wss = new WSServer({ noServer: true });
const jwt = require('jsonwebtoken');
const logger = require('../utils/logging');
const { User } = require('../models/User');


const SocketEvent = {
  _ALL: '_all',
  CONNECT: 'connect', // Outbound only

  ACK: 'ack',

  // Cache
  CACHE_POPULATE: 'cachePopulate',
  CACHE_UPDATE: 'cacheUpdate',

  // User
  SET_DISPLAY_NAME: 'setDisplayName',
  SET_LAST_SCREEN: 'setLastScreen',
  SET_LAST_CHAT: 'setLastChat',

  // Chat
  CREATE_CHAT: 'createChat',
  UPDATE_CHAT: 'updateChat',
  DELETE_CHAT: 'deleteChat',
  CHAT_UPDATE_MEMBERS: 'chatUpdateMembers',
};

const onUpgrade = async (req, socket, head) => {
  try {
    if (req.url !== '/socket') return socket.destroy();
    const cookies = req.headers.cookie?.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {}) || {};
  
    if (!cookies.zxtoken) return socket.destroy();
  
    const token = cookies.zxtoken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return socket.destroy();
  
    const user = await User.findById(decoded.id);
    if (!user) return socket.destroy();

    req.user = user;

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.user = req.user;
  
      wss.emit('connection', ws, req, req.user);
    });
  } catch (e) {
    console.error(e);
    socket.destroy();
  }
}

const send = (ws, event, payload) => {
  if (ws.readyState !== 1) return;
  ws.send(JSON.stringify({ event, payload }));
}

const broadcast = (event, payload) => {
  wss.clients.forEach((client) => send(client, event, payload));
}

const cacheUpdate = (payload, affectedUsers) => {
  const clients = Array.from(wss.clients);
  affectedUsers = affectedUsers.map(id => id.toString());

  for (const client of clients) {
    if (affectedUsers.includes(client.user._id.toString())) send(client, SocketEvent.CACHE_UPDATE, payload);
  }
}

module.exports = {
  SocketEvent,
  wss,
  onUpgrade,
  send,
  broadcast,
  cacheUpdate,
};

const { createChat, updateChat, deleteChat, updateMembers } = require('./chatEvents');
const { setDisplayName, setLastScreen, setLastChat } = require('./userEvents');
const { cachePopulate } = require('./cacheEvents');

const eventHandlers = [
  { event: SocketEvent.CACHE_POPULATE, handler: cachePopulate },
  
  { event: SocketEvent.SET_DISPLAY_NAME, handler: setDisplayName },
  { event: SocketEvent.SET_LAST_SCREEN, handler: setLastScreen },
  { event: SocketEvent.SET_LAST_CHAT, handler: setLastChat },

  { event: SocketEvent.CREATE_CHAT, handler: createChat },
  { event: SocketEvent.UPDATE_CHAT, handler: updateChat },
  { event: SocketEvent.DELETE_CHAT, handler: deleteChat },
  { event: SocketEvent.CHAT_UPDATE_MEMBERS, handler: updateMembers },
];

wss.on('connection', (ws, req, user) => {
  send(ws, 'connect', user);

  ws.on('message', (message) => {
    try {
      const { event, payload } = JSON.parse(message);
      const replyTo = payload?.replyTo;
      
      const handler = eventHandlers.find((h) => h.event === event)?.handler;
      if (!handler) return logger.logWarn(`No handler for event ${event}`);

      handler(user, payload).then(result => {
        if (!replyTo) return;

        if (result) send(ws, event, { ...result, replyTo });
        else send(ws, SocketEvent.ACK, { ack: true, replyTo });
      }).catch((e) => {
        logger.logError(`Error handling event ${event}`, e);
        if (replyTo) send(ws, event, { error: true, message: e.message || 'Unknown error', replyTo });
      });
    } catch (e) {
      logger.logError(e);
    }
  });
});
