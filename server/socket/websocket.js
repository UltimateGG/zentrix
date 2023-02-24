const WSServer = require('ws').Server;
const wss = new WSServer({ server: require('../server'), path: '/socket', verifyClient });
const jwt = require('jsonwebtoken');
const logger = require('../utils/logging');
const { User } = require('../models/User');


const SocketEvent = {
  _ALL: '_all',
  CONNECT: 'connect', // Outbound only
  PING: 'ping', // Outbound only
  PONG: 'pong', // Inbound only

  ACK: 'ack',

  // Cache
  CACHE_POPULATE: 'cachePopulate',
  CACHE_UPDATE: 'cacheUpdate',

  // User
  SET_DISPLAY_NAME: 'setDisplayName',

  // Chat
  CREATE_CHAT: 'createChat',
  UPDATE_CHAT: 'updateChat',
  DELETE_CHAT: 'deleteChat',
  CHAT_UPDATE_MEMBERS: 'chatUpdateMembers',

  // Message
  MESSAGE_CREATE: 'messageCreate',
  GET_MESSAGES: 'getMessages',
  MESSAGE_DELETE: 'messageDelete',
};

async function verifyClient(info, done) {
  try {
    const { req } = info;
    const token = decryptToken(req.url.split('?n=')[1]);
    if (!token || token === 'null') return done(false);
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return done(false);
  
    const user = await User.findById(decoded.id);
    if (!user) return done(false);

    req.user = user;
    done(true);
    return;
  } catch (e) {}

  done(false);
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
  const doAll = affectedUsers === '*';
  if (!doAll) affectedUsers = affectedUsers.map(id => id.toString());

  for (const client of clients)
    if (doAll || affectedUsers.includes(client.user._id.toString())) send(client, SocketEvent.CACHE_UPDATE, payload);
}

module.exports = {
  SocketEvent,
  wss,
  send,
  broadcast,
  cacheUpdate,
};

const { cachePopulate } = require('./cacheEvents');
const { setDisplayName } = require('./userEvents');
const { createChat, updateChat, deleteChat, updateMembers } = require('./chatEvents');
const { messageCreate, getMessages, messageDelete } = require('./messageEvents');
const { decryptToken } = require('../utils/utils');

const eventHandlers = [
  { event: SocketEvent.CACHE_POPULATE, handler: cachePopulate },
  
  { event: SocketEvent.SET_DISPLAY_NAME, handler: setDisplayName },

  { event: SocketEvent.CREATE_CHAT, handler: createChat },
  { event: SocketEvent.UPDATE_CHAT, handler: updateChat },
  { event: SocketEvent.DELETE_CHAT, handler: deleteChat },
  { event: SocketEvent.CHAT_UPDATE_MEMBERS, handler: updateMembers },

  { event: SocketEvent.MESSAGE_CREATE, handler: messageCreate },
  { event: SocketEvent.GET_MESSAGES, handler: getMessages },
  { event: SocketEvent.MESSAGE_DELETE, handler: messageDelete },
];

wss.on('connection', (ws, req) => {
  ws.isAlive = true;
  ws.user = req.user;
  send(ws, 'connect', req.user);

  ws.on('message', (message) => {
    try {
      const { event, payload } = JSON.parse(message);
      const replyTo = payload?.replyTo;

      if (event === SocketEvent.PONG) {
        ws.isAlive = true;
        return;
      }
      
      const handler = eventHandlers.find((h) => h.event === event)?.handler;
      if (!handler) return logger.logWarn(`No handler for event ${event}`);

      handler(req.user, payload).then(result => {
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

setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    send(ws, SocketEvent.PING, {});
  });
}, 5_000);

