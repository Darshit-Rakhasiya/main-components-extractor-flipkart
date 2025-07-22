const express = require('express');
const router = express.Router();
const { getAllDevLogs } = require('../controllers/devLogAuthController');

router.get('/fetch', getAllDevLogs)

module.exports = router;