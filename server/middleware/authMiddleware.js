const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { decryptToken } = require('../utils/utils');


const auth = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'OK' });
    return;
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: true, message: 'Unauthorized' });

    const decoded = jwt.verify(decryptToken(token), process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

module.exports = {
  auth
};
