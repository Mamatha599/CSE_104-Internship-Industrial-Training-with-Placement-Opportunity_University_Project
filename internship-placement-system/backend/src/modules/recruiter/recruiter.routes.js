const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../utils/response.util');

router.get('/dashboard', (req, res) => sendSuccessResponse(res, 'Recruiter dashboard endpoint'));
router.get('/opportunities', (req, res) => sendSuccessResponse(res, 'Recruiter opportunities endpoint'));
router.get('/applications', (req, res) => sendSuccessResponse(res, 'Recruiter applications endpoint'));

module.exports = router;