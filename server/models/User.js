const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { bucket, region } = require('../utils/s3');


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
    maxLength: 20,
  }
}, { toJSON: { versionKey: false } });

const getRandomUserIcon = () => {
  const max = 6;
  const num = Math.floor(Math.random() * max) + 1;

  return `https://${bucket}.s3.${region}.amazonaws.com/static/user${num}.png`;
}

module.exports = {
  User: mongoose.model('users', UserSchema),
  getRandomUserIcon
};
