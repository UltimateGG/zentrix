const mongoose = require('mongoose');
const db = mongoose.connection;
const logger = require('./logging');


const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://localhost/zentrix', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((res, err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

db.on('open', () => logger.logInfo('Successfully connected to database'));

db.on('error', (e) => {
  logger.logError('MongoDB Error:', e);
  process.exit(1);
});

module.exports = {
  connectToDatabase
};
