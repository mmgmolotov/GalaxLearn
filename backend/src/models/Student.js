// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'student',
    },
    city: String,
    country: String,
    phone: String,
    avatar: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', StudentSchema);
