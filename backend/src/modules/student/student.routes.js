const express = require('express');
const studentController = require('./student.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');

const router = express.Router();

// Public routes
router.post('/register', studentController.register);
router.post('/login', studentController.login);

// Protected routes
router.get('/profile', authenticateToken, requireRole(['student']), studentController.getProfile);
router.put('/profile', authenticateToken, requireRole(['student']), studentController.updateProfile);

module.exports = router;