const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    updateAcess: { type: Boolean, required: true, default: false },
    apiCalls: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);