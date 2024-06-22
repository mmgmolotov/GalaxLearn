// models/Teacher.js
const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
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
        default: 'teacher',
    },
    city: String,
    country: String,
    phone: String,
    avatar: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Teacher', TeacherSchema);
