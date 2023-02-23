const { cacheUpdate } = require('./websocket');


const setDisplayName = async (user, payload) => {
  if (!payload.displayName || typeof payload.displayName !== 'string') return;
  if (payload.displayName.length < 3 || payload.displayName.length > 20) return;

  user.displayName = payload.displayName;
  await user.save();

  cacheUpdate({ users: [user.toJSON()] }, '*');
}

const setLastChat = async (user, payload) => {
  user.lastChat = payload.id;
  await user.save();
}

const setLastScreen = async (user, payload) => {
  user.lastScreen = payload.screen;
  user.lastChat = null;
  await user.save();
}


module.exports = {
  setDisplayName,
  setLastChat,
  setLastScreen
};
