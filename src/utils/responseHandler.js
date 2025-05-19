// success handler
const success = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// error handler
const error = (res, statusCode, message, error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  });
};

module.exports = { success, error };
