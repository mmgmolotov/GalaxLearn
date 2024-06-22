// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to get the correct collection
async function getUserCollection(role) {
    if (role === 'teacher') {
        return Teacher;
    } else if (role === 'student') {
        return Student;
    }
    throw new Error('Invalid user role');
}

// Fetch user profile
router.get('/user/:id', authMiddleware.verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userCollection = await getUserCollection(req.user.role);

        const user = await userCollection.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                city: user.city,
                country: user.country,
                phone: user.phone,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Server error fetching user.' });
    }
});

// Update user profile
router.put('/user/:id', authMiddleware.verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log('User ID from token:', req.user._id);
        console.log('User ID from URL:', id);
        console.log('User Role:', req.user.role);
        console.log('Update Data:', updateData);

        if (req.user._id.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this user.' });
        }

        const userCollection = await getUserCollection(req.user.role);

        // Ensure that only the allowed fields are updated
        const allowedUpdates = {
            name: updateData.name,
            city: updateData.city,
            country: updateData.country,
            phone: updateData.phone,
            avatar: updateData.avatar,
        };

        const user = await userCollection.findByIdAndUpdate(id, allowedUpdates, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        console.log('Updated User:', user);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                city: user.city,
                country: user.country,
                phone: user.phone,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error updating profile.' });
    }
});

module.exports = router;
