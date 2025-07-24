// routes/metadataRoutes.js
const express = require('express');
const router = express.Router();
const { submitMetadata, countMetadata } = require('../controllers/metaDataAuthController');

router.post('/submit', submitMetadata);
router.get('/count', countMetadata);

module.exports = router;
