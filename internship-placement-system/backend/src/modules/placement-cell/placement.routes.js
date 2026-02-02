const express = require('express');
const router = express.Router();
const placementController = require('./placement.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const { authorizeRoles, USER_ROLES } = require('../../middlewares/role.middleware');

// Placement cell routes
router.get('/dashboard', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.PLACEMENT_CELL), 
  placementController.getDashboard
);

router.post('/opportunities', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.PLACEMENT_CELL), 
  placementController.createOpportunity
);

router.get('/students', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.PLACEMENT_CELL), 
  placementController.getAllStudents
);

module.exports = router;