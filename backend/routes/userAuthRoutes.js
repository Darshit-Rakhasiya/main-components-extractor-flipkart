const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUser, deleteUser, updateUser } = require('../controllers/userAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerUser);
router.post('/login', loginUser);
router.get('/fetch', getAllUser)
router.post('/delete', deleteUser);
router.post('/update', updateUser)

module.exports = router;