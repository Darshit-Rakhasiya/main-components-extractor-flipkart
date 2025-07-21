const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAllAdmin, deleteAdmin, updateAdmin } = require('../controllers/adminAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerAdmin);
router.post('/login', loginAdmin);
router.get('/fetch', getAllAdmin)
router.post('/delete', deleteAdmin)
router.post('/update', updateAdmin)

module.exports = router;