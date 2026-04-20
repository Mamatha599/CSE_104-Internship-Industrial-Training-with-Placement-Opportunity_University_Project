const express = require('express');
const router = express.Router();
const studentController = require('./student.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const { authorizeRoles, USER_ROLES } = require('../../middlewares/role.middleware');

// Student profile routes
router.get('/profile', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.STUDENT), 
  studentController.getProfile
);

router.put('/profile', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.STUDENT), 
  studentController.updateProfile
);

// Student applications
router.get('/applications', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.STUDENT), 
  studentController.getApplications
);

router.post('/applications/:opportunityId', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.STUDENT), 
  studentController.applyForOpportunity
);

// Resume upload
router.post('/upload-resume', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.STUDENT), 
  studentController.uploadResume
);

// Admin/Faculty routes for student management
router.get('/', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.PLACEMENT_CELL, USER_ROLES.FACULTY), 
  studentController.getAllStudents
);

router.get('/:studentId', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.PLACEMENT_CELL, USER_ROLES.FACULTY), 
  studentController.getStudentById
);

module.exports = router;