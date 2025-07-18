const express = require('express');
const router = express.Router();
const { registerKey, updateKey } = require('../controllers/keyAuthController');

router.post('/register', registerKey);
router.post('/update', updateKey);

module.exports = router;