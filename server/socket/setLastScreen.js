module.exports = async (user, payload) => {
  if (!payload.screen || typeof payload.screen !== 'string') return;

  user.lastScreen = payload.screen;
  await user.save();
}
