const onEvent = (user, payload) => {
  if (!payload.screen || typeof payload.screen !== 'string') return;

  user.lastScreen = payload.screen;
  user.save();
}


module.exports = onEvent;
