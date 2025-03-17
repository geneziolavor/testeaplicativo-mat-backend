const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    school: { type: String, required: true },
    grade: { type: String, required: true },
    age: { type: Number, required: true },
    score: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);