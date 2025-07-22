const express = require('express');
const router = express.Router();
const { getAllLogs, insertLog } = require('../controllers/logAuthController');

router.get('/fetch', getAllLogs)
router.post('/insert', insertLog)

module.exports = router;