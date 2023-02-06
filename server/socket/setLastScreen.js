module.exports = (user, payload) => {
  if (!payload.screen || typeof payload.screen !== 'string') return;

  user.lastScreen = payload.screen;
  user.save();
}
