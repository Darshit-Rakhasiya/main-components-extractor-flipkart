// routes/metadataRoutes.js
const express = require('express');
const router = express.Router();
const { submitMetadata, countMetadata, fetchMetaData } = require('../controllers/metaDataAuthController');

router.post('/submit', submitMetadata);
router.get('/count', countMetadata);
router.get('/fetch', fetchMetaData)

module.exports = router;
