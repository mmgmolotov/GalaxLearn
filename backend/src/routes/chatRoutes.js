// src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');

// Get chat messages between two users
router.get('/chat/:senderId/:receiverId', authMiddleware.verifyUser, async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        if (!messages) {
            return res.status(404).json({ success: false, message: 'Messages not found.' });
        }

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error fetching messages.' });
    }
});

// Send a new chat message
router.post('/chat', authMiddleware.verifyUser, async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const newMessage = new Chat({ senderId, receiverId, content });

        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully.', newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Server error sending message.' });
    }
});

module.exports = router;
