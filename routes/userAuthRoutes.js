const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerUser);
router.post('/login', loginUser);

module.exports = router;