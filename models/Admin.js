const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    access: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);