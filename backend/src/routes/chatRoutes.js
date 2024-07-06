// src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to get user details
async function getUserDetails(userId) {
    return await Teacher.findById(userId) || await Student.findById(userId);
}

// Get chat messages between two users
router.get('/chat/:senderId/:receiverId', authMiddleware.verifyUser, async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        console.log(`Fetching messages between ${senderId} and ${receiverId}`);
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

// Get conversations for a user
router.get('/conversations', authMiddleware.verifyUser, async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(`Fetching conversations for user ${userId}`);

        const messages = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", userId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    messageId: { $first: "$_id" },
                    content: { $first: "$content" },
                    createdAt: { $first: "$createdAt" }
                }
            }
        ]);

        const conversations = await Promise.all(messages.map(async msg => {
            const user = await getUserDetails(msg._id);
            return {
                userId: user._id,
                username: user.name,
                avatar: user.avatar,
                lastMessage: msg.content,
                lastMessageTime: msg.createdAt
            };
        }));

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Server error fetching conversations.' });
    }
});

module.exports = router;
