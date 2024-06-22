// src/controllers/authController.js
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  // Registration logic here
};

// Login user
const loginUser = async (req, res) => {
  // Login logic here
};

// Fetch user profile
const fetchUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await Teacher.findById(id) || await Student.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user profile.' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, country, phone, avatar } = req.body;
    let updatedUser = await Teacher.findByIdAndUpdate(id, { name, city, country, phone, avatar }, { new: true }) ||
                      await Student.findByIdAndUpdate(id, { name, city, country, phone, avatar }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user profile.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  fetchUserProfile,
  updateUserProfile,
};
