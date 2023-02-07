const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../utils/logging');


const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  iconURL: {
    type: String,
    required: true,
    maxLength: 1000
  },
  displayName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  lastChat: {
    type: Schema.Types.ObjectId,
    ref: 'chats',
    default: null
  },
  lastScreen: {
    type: String,
    maxLength: 500,
    default: null
  }
});

const getRandomIcon = () => {
  const max = 5;
  const num = Math.floor(Math.random() * max) + 1;

  return `${process.env.APP_URL}/static/default${num}.png`;
}

module.exports = {
  User: mongoose.model('users', UserSchema),
  getRandomIcon
};
