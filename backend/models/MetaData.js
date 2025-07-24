const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
    apiUrl: {
        type: String,
        required: true,
        unique: true
    },
    apiName: {
        type: String,
        required: true,
        unique: true
    },
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    mongoDbUrl: {
        type: String,
        required: true
    },
    databaseName: {
        type: String,
        required: true
    },
    keyCollectionName: {
        type: String,
        required: true
    },
    logCollectionName: {
        type: String,
        required: true
    },
    domainName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Metadata', metadataSchema);
