require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logging');
const { errorHandler } = require('./middleware/errorHandler');
const { connectToDatabase } = require('./utils/database');
const websocket = require('./socket/websocket');

const server = require('http').createServer(app);


// Middleware
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1');
  res.removeHeader('X-Powered-By');
  next();
});

app.use(express.static('public'));


// Routes
app.use('/auth', require('./routes/auth'));

server.on('upgrade', websocket.onUpgrade);

app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
  server.listen(PORT, () => logger.logInfo(`Server listening on port ${PORT}`));
});
