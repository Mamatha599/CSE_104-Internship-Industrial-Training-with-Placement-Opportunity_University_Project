const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../utils/response.util');

router.get('/', (req, res) => sendSuccessResponse(res, 'Faculty routes'));
router.get('/students', (req, res) => sendSuccessResponse(res, 'Faculty students endpoint'));
router.post('/approve/:applicationId', (req, res) => sendSuccessResponse(res, 'Approve application endpoint'));

module.exports = router;