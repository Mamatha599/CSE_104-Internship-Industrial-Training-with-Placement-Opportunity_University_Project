const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/response.util');

// Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return sendErrorResponse(res, 'Access token required', 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return sendErrorResponse(res, 'Invalid or expired token', 403);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};