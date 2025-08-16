// Centralized error handler middleware

function errorHandler(err, req, res, next) {
  console.error(err);
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ message: err.message, stack: err.stack });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { errorHandler };
