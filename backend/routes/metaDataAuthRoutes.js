// routes/metadataRoutes.js
const express = require('express');
const router = express.Router();
const { submitMetadata, countMetadata, fetchMetaData, updateStatus } = require('../controllers/metaDataAuthController');

router.post('/submit', submitMetadata);
router.get('/count', countMetadata);
router.get('/fetch', fetchMetaData)
router.put('/update-status', updateStatus)

module.exports = router;
