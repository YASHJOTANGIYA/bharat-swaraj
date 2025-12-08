const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a news article
router.get('/:newsId', async (req, res) => {
    try {
        const comments = await Comment.find({ newsId: req.params.newsId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ALL comments (for admin)
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 }).populate('newsId', 'title');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new comment
router.post('/', async (req, res) => {
    const comment = new Comment({
        newsId: req.body.newsId,
        userId: req.body.userId,
        username: req.body.username,
        content: req.body.content
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
