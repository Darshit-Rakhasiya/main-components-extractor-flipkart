const mongoose = require('mongoose');

const devLogSchema = new mongoose.Schema({
    message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DevLog', devLogSchema);