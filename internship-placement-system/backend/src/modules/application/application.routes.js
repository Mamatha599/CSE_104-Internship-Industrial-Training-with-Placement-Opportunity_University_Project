const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../utils/response.util');

router.get('/', (req, res) => sendSuccessResponse(res, 'Get all applications endpoint'));
router.get('/:id', (req, res) => sendSuccessResponse(res, 'Get application by ID endpoint'));
router.put('/:id/status', (req, res) => sendSuccessResponse(res, 'Update application status endpoint'));

module.exports = router;