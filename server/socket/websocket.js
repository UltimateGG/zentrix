const WSServer = require('ws').Server;
const wss = new WSServer({ noServer: true });
const jwt = require('jsonwebtoken');
const logger = require('../utils/logging');
const { User } = require('../models/User');


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
  ws.send(JSON.stringify({ event, payload }));
};

const broadcast = (event, payload) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) send(client, event, payload);
  });
};

module.exports = {
  wss,
  onUpgrade,
  send,
  broadcast
};

const eventHandlers = [
  { event: 'setLastScreen', handler: require('./setLastScreen') },
  { event: 'setDisplayName', handler: require('./setDisplayName') },
  { event: 'createChat', handler: require('./createChat') },
  { event: 'populateCache', handler: require('./populateCache') },
];

wss.on('connection', (ws, req, user) => {
  send(ws, 'connect', user);

  ws.on('message', (message) => {
    try {
      const { event, payload, replyTo } = JSON.parse(message);
      
      const handler = eventHandlers.find((h) => h.event === event)?.handler;
      if (!handler) return logger.logWarn(`No handler for event ${event}`);

      handler(user, payload).then((result) => {
        if (result) send(ws, event, { ...result, replyTo });
      }).catch((e) => {
        logger.logError(e);
        send(ws, event, { error: true, replyTo });
      });
    } catch (e) {
      logger.logError(e);
    }
  });
});
