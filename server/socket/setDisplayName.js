module.exports = (user, payload) => {
  if (!payload.displayName || typeof payload.displayName !== 'string') return;
  if (payload.displayName.length < 3 || payload.displayName.length > 20) return;

  user.displayName = payload.displayName;
  user.save();
}
