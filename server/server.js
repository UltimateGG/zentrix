require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./utils/logging');
const { errorHandler } = require('./middleware/errorHandler');
const { connectToDatabase } = require('./utils/database');


// Middleware
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1');
  res.removeHeader('X-Powered-By');
  next();
});


// Routes
app.use('/auth', require('./routes/auth'));

app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
  app.listen(PORT, () => logger.logInfo(`Server listening on port ${PORT}`));
});
