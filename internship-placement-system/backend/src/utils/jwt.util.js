const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate token with user info
const generateAuthToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  return generateToken(payload);
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthToken
};