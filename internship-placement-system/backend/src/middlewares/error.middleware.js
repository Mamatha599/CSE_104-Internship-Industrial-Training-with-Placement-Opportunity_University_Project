const { sendErrorResponse } = require('../utils/response.util');

const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return sendErrorResponse(res, 'Validation Error', 400, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendErrorResponse(res, `${field} already exists`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendErrorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendErrorResponse(res, 'Token expired', 401);
  }

  // Default error
  sendErrorResponse(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = errorMiddleware;