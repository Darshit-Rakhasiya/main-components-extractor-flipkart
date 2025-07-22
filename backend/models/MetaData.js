const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
    platform: String,
    category: String,
    type: String,
    database: String,
    collection: String,
    
}, { timestamps: true });

module.exports = mongoose.model('Metadata', metadataSchema);
