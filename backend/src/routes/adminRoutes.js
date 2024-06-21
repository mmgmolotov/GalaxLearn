// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Routes for admin functionalities
router.get('/users', verifyAdmin, adminController.getUsers);
router.delete('/users/:id', verifyAdmin, adminController.deleteUser);

// More admin routes can be added here

module.exports = router;
