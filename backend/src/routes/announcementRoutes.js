const express = require('express');
const Announcement = require('../models/Announcement');
const Topic = require('../models/Topic');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch all announcements
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'name country phone showCountry showPhone')
            .populate('topic', 'name')
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
        res.json({ success: true, announcements });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message || error });
    }
});

// Create a new announcement
router.post('/announcements', verifyUser, async (req, res) => {
    const { title, content, topicId, customTopic } = req.body;

    try {
        const newAnnouncement = new Announcement({
            title,
            content,
            author: req.user._id,
            authorModel: req.user.role === 'teacher' ? 'Teacher' : 'Student',
            topic: topicId,
            customTopic
        });

        const savedAnnouncement = await newAnnouncement.save();
        res.json({ success: true, announcement: savedAnnouncement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create announcement', error });
    }
});

// Fetch all topics
router.get('/topics', async (req, res) => {
    try {
        const topics = await Topic.find();
        res.json({ success: true, topics });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch topics', error });
    }
});

// Add a new topic
router.post('/topics', verifyUser, async (req, res) => {
    const { name } = req.body;

    try {
        const newTopic = new Topic({ name });
        const savedTopic = await newTopic.save();
        res.json({ success: true, topic: savedTopic });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add topic', error });
    }
});

module.exports = router;
