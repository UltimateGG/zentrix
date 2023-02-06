const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

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
  if (!payload || payload.iss !== 'https://accounts.google.com' || payload.aud !== process.env.GOOGLE_CLIENT_ID)
    throw new Error('Invalid token');

  const userId = payload.sub;
  
}));


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
