const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User, getRandomUserIcon } = require('../models/User');
const { encryptToken } = require('../utils/utils');

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);


router.get('/login', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new Error('No token provided');

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  }).catch(() => {
    throw new Error('Invalid token');
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error('Invalid token');

  const userId = payload.sub;
  let user = await User.findOne({ googleId: userId });

  if (!user) { // Create new user
    user = new User({
      googleId: userId,
      email: payload.email || '',
      iconURL: payload.picture || getRandomUserIcon(),
      displayName: payload.name || userId,
    });

    await user.save();
  }
  
  const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token: encryptToken(authToken) });
}));


module.exports = router;
