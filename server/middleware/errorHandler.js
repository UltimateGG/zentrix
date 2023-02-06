const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode === 200 ? 400 : res.statusCode);

  res.json({
      message: err.message,
      error: true,
      stack: process.env.NODE_ENV === 'DEVELOPMENT' ? err.stack : null
  });
}

module.exports = {
  errorHandler
};
