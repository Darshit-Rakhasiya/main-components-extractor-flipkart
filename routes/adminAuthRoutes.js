const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAllAdmin } = require('../controllers/adminAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerAdmin);
router.post('/login', loginAdmin);
router.get('/fetch', getAllAdmin)

module.exports = router;