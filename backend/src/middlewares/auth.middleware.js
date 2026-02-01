const { verifyToken } = require('../utils/jwt.util');
const { sendError } = require('../utils/response.util');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Access token required');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 403, 'Invalid or expired token');
  }
};

module.exports = { authenticateToken };