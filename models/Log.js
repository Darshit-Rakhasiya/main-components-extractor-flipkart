const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    params: { type: Object, required: true },
    status_code: { type: Number, required: true },
    key: { type: String, required: true },
    response: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);