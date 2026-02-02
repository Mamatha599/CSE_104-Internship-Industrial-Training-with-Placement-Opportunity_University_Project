const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../utils/response.util');

router.get('/dashboard', (req, res) => sendSuccessResponse(res, 'Analytics dashboard endpoint'));
router.get('/placement-stats', (req, res) => sendSuccessResponse(res, 'Placement statistics endpoint'));
router.get('/application-stats', (req, res) => sendSuccessResponse(res, 'Application statistics endpoint'));

module.exports = router;