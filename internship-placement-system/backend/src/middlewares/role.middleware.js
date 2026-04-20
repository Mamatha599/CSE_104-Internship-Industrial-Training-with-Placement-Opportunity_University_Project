const { sendErrorResponse } = require('../utils/response.util');

// Role-based access control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(res, 'Access denied. Insufficient permissions', 403);
    }

    next();
  };
};

// User roles enum
const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  PLACEMENT_CELL: 'placement_cell',
  RECRUITER: 'recruiter',
  ADMIN: 'admin'
};

module.exports = {
  authorizeRoles,
  USER_ROLES
};