const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerAdmin);
router.post('/login', loginAdmin);

module.exports = router;