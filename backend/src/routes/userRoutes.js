const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to get the correct collection
function getUserCollection(role) {
    if (role === 'teacher') {
        return Teacher;
    } else if (role === 'student') {
        return Student;
    }
    throw new Error('Invalid user role');
}

// Fetch user profile
router.get('/users/:id', authMiddleware.verifyUser, async (req, res) => {
    console.log('Fetching user with ID:', req.params.id);
    try {
        const { id } = req.params;
        const user = await Teacher.findById(id) || await Student.findById(id);
        if (!user) {
            console.log('User not found with ID:', id);
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
router.put('/users/:id', authMiddleware.verifyUser, async (req, res) => {
    console.log('Updating user with ID:', req.params.id);
    try {
        const { id } = req.params;
        const { name, city, country, phone, avatar } = req.body;

        const user = await Teacher.findById(id) || await Student.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.name = name;
        user.city = city;
        user.country = country;
        user.phone = phone;
        user.avatar = avatar;

        await user.save();

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
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Server error updating user.' });
    }
});

module.exports = router;
