const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../../utils/response.util');

// Authentication middleware specific to auth module
const authMiddleware = {
  // Validate registration data
  validateRegistration: (req, res, next) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return sendErrorResponse(res, 'All fields are required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendErrorResponse(res, 'Invalid email format', 400);
    }

    // Password validation
    if (password.length < 6) {
      return sendErrorResponse(res, 'Password must be at least 6 characters long', 400);
    }

    next();
  },

  // Validate login data
  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return sendErrorResponse(res, 'Email and password are required', 400);
    }

    next();
  },

  // Validate password change
  validatePasswordChange: (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return sendErrorResponse(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return sendErrorResponse(res, 'New password must be at least 6 characters long', 400);
    }

    next();
  }
};

module.exports = authMiddleware;