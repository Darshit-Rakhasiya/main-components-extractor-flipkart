const express = require('express');
const router = express.Router();
const { registerKey, updateKey, deleteKey, getAllKeys,findKey } = require('../controllers/keyAuthController');

router.post('/register', registerKey);
router.post('/update', updateKey);
router.get('/fetch', getAllKeys)
router.post('/delete', deleteKey)
router.post('/findKey', findKey)

module.exports = router;