// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch user profile
router.get('/users/:id', authMiddleware.verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Teacher.findById(id) || await Student.findById(id);
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

module.exports = router;
