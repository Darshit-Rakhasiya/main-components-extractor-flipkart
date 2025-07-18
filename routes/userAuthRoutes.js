const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userAuthController');

// POST /api/auth/register
router.post('/register', registerUser);

module.exports = router;
