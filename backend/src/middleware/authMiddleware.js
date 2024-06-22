// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

exports.verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Authorization Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided or token format is incorrect' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token received:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        // Check in both Teachers and Students collections
        let user = await Teacher.findById(decoded.id);
        if (!user) {
            user = await Student.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed', error });
    }
};
