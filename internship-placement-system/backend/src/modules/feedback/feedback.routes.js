const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../utils/response.util');

router.get('/', (req, res) => sendSuccessResponse(res, 'Get feedback endpoint'));
router.post('/', (req, res) => sendSuccessResponse(res, 'Create feedback endpoint'));
router.get('/certificates/:studentId', (req, res) => sendSuccessResponse(res, 'Generate certificate endpoint'));

module.exports = router;