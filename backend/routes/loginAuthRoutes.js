const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginAuthController');

router.post('/', loginUser)

module.exports = router;