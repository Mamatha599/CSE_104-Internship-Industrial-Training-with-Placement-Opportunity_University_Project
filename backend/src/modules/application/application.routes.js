const express = require('express');
const applicationController = require('./application.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');

const router = express.Router();

// Protected routes for students
router.post('/', authenticateToken, requireRole(['student']), applicationController.applyForOpportunity);
router.get('/', authenticateToken, requireRole(['student']), applicationController.getMyApplications);
router.get('/:id', authenticateToken, requireRole(['student']), applicationController.getApplicationById);

module.exports = router;