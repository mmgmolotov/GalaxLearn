// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    enum: ['student', 'teacher'],
    required: true,
  },
  city: String,
  country: String,
  phone: String,
  avatar: String, // URL to the user's avatar image
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);