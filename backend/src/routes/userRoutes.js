// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get user profile
router.get('/user/:id', authMiddleware.verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user.' });
  }
});

// Update user profile
router.put('/user/:id', authMiddleware.verifyUser, async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error updating user.' });
  }
});

module.exports = router;
