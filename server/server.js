require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logging');
const { errorHandler } = require('./middleware/errorHandler');
const { connectToDatabase } = require('./utils/database');
const { auth } = require('./middleware/authMiddleware');
const fs = require('fs');

const server = require('https').createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app);

module.exports = server;
const websocket = require('./socket/websocket');

// Middleware
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1');
  res.removeHeader('X-Powered-By');
  res.setHeader('Access-Control-Allow-Origin', 'https://zentrix.app');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(require('cookie-parser')());


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/media', auth, require('./routes/media'));

app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
  server.listen(PORT, () => logger.logInfo(`Server listening on port ${PORT}`));
});
