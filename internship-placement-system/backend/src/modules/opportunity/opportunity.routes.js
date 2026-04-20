const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../utils/response.util');

router.get('/', (req, res) => sendSuccessResponse(res, 'Get all opportunities endpoint'));
router.post('/', (req, res) => sendSuccessResponse(res, 'Create opportunity endpoint'));
router.get('/:id', (req, res) => sendSuccessResponse(res, 'Get opportunity by ID endpoint'));
router.put('/:id', (req, res) => sendSuccessResponse(res, 'Update opportunity endpoint'));
router.delete('/:id', (req, res) => sendSuccessResponse(res, 'Delete opportunity endpoint'));

module.exports = router;