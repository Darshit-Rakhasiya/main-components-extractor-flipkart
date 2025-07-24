const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUser, deleteUser, updateUser, countUser } = require('../controllers/userAuthController');
const validateInput = require('../middlewares/validateInput');

router.post('/register', validateInput, registerUser);
router.post('/login', loginUser);
router.get('/fetch', getAllUser)
router.post('/delete', deleteUser);
router.post('/update', updateUser)
router.get('/count', countUser)

module.exports = router;