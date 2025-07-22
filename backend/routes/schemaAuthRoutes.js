const express = require('express');
const router = express.Router();
const { getAllSchema, checkSchemaExists } = require('../controllers/schemaAuthController');

router.get('/fetch', getAllSchema);
router.post('/checker', checkSchemaExists);  

module.exports = router;
