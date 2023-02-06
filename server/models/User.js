const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
  },
  chats: [{
    type: Schema.Types.ObjectId,
    ref: 'chats',
    default: []
  }]
});

const getRandomIcon = () => {
  const icons = [ // TODO
    'https://i.imgur.com/0o48UoR.png',
    'https://i.imgur.com/0o48UoR.png',
    'https://i.imgur.com/0o48UoR.png',
    'https://i.imgur.com/0o48UoR.png',
    'https://i.imgur.com/0o48UoR.png',
  ];

  return icons[Math.floor(Math.random() * icons.length)];
};

module.exports = {
  User: mongoose.model('users', UserSchema),
  getRandomIcon
};
