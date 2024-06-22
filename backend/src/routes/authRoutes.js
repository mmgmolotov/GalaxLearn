// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to get the correct collection
function getUserCollection(role) {
    if (role === 'teacher') {
        return Teacher;
    } else if (role === 'student') {
        return Student;
    }
    throw new Error('Invalid user role');
}

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userCollection = getUserCollection(role);

        // Check if user already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new userCollection({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Generate token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
            token
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Check if user exists in Teacher or Student collections
        let user = await Teacher.findOne({ email });
        if (!user) {
            user = await Student.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password.' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        // Fetch the latest user data
        const freshUser = await getUserCollection(user.role).findById(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: {
                id: freshUser._id,
                name: freshUser.name,
                email: freshUser.email,
                role: freshUser.role,
                city: freshUser.city,
                country: freshUser.country,
                phone: freshUser.phone,
                avatar: freshUser.avatar
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

module.exports = router;
