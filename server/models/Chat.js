const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../utils/logging');


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
  lastMessage: {// TODO ref
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

ChatSchema.post('save', (error, doc, next) => {
  if (error.name === 'ValidationError') {
    logger.logError('Error saving schema:', error.message);
  } else {
    logger.logError('Error saving schema:', error);
    next(error);
  }
});

module.exports = {
  Chat: mongoose.model('chats', ChatSchema),
};
