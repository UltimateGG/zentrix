const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
  iconURL: {
    type: String,
    required: true,
    maxLength: 1000
  },
  lastMessage: {// TODO ref?
    type: String,
    maxLength: 1000,
    default: null
  },
  encrypted: {
    type: Boolean,
    required: true,
    default: false
  },
  password: {
    type: String,
    maxLength: 100,
    default: null
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    maxLength: 500 // 500 group chat users max
  }]
});

module.exports = {
  Chat: mongoose.model('chats', ChatSchema),
};
