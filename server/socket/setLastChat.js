module.exports = async (user, payload) => {
  if (!payload.id) return;

  user.lastChat = payload.id;
  await user.save();
}
