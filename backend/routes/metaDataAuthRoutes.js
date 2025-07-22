// routes/metadataRoutes.js
const express = require('express');
const router = express.Router();
const { submitMetadata } = require('../controllers/metaDataAuthController');

router.post('/submit', submitMetadata);

module.exports = router;
