const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatType = {
  USER: 0,
  SYSTEM: 1,
};

const MessageSchema = new Schema({
  type: {
    type: Number,
    enum: Object.values(ChatType),
    required: true,
    default: ChatType.USER,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'chats',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 4096,
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now,
  }
}, { toJSON: { versionKey: false } });

MessageSchema.path('content').validate(value => value.trim().length > 0, 'Message is too short');

module.exports = {
  Message: mongoose.model('messages', MessageSchema),
  ChatType,
};
