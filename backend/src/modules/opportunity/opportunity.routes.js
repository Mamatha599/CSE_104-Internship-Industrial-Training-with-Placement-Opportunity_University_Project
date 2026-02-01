const express = require('express');
const opportunityController = require('./opportunity.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Protected routes for students
router.get('/', authenticateToken, opportunityController.getOpportunities);
router.get('/:id', authenticateToken, opportunityController.getOpportunityById);

module.exports = router;