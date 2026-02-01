const { sendError } = require('../utils/response.util');

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, 'Insufficient permissions');
    }
    next();
  };
};

module.exports = { requireRole };