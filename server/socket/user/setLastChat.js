module.exports = async (user, payload) => {
  user.lastChat = payload.id;
  await user.save();
}
