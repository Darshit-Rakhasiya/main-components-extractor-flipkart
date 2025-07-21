const express = require('express');
const router = express.Router();
const { registerSuperAdmin, loginSuperAdmin, getAllSuperAdmin, deleteSuperAdmin, updateSuperAdmin } = require('../controllers/superAdminAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerSuperAdmin);
router.post('/login', loginSuperAdmin);
router.get('/fetch', getAllSuperAdmin)
router.post('/delete', deleteSuperAdmin)
router.post('/update', updateSuperAdmin)

module.exports = router;