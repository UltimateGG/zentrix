const jwt = require('jsonwebtoken');
const { User } = require('../models/User');


const auth = async (req, res, next) => {
  try {
    const token = req.cookies.zxtoken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
