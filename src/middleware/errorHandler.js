function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || 500;
  return res.status(status).json({
    error: status === 500 ? 'Something went wrong on our end.' : err.message,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found.' });
}

module.exports = { errorHandler, notFoundHandler };
