const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    usage: { type: Number, required: true, default: 0 },
    limit: { type: Number, required: true, default: 0 },
    status: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Key', keySchema);