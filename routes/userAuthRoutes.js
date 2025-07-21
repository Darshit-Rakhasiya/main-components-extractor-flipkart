const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUser } = require('../controllers/userAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerUser);
router.post('/login', loginUser);
router.get('/fetch', getAllUser)

module.exports = router;