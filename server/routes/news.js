const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Notification = require('../models/Notification');
const { getNewsById, deleteNews } = require('../controllers/newsController');

// Get all news with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, limit, exclude } = req.query;
        let query = {};

        // Filter by category if provided
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') }; // Case-insensitive match
        }

        // Exclude specific ID (useful for "Related News" to exclude current article)
        if (exclude) {
            query._id = { $ne: exclude };
        }

        // Filter by isShort (true/false)
        if (req.query.isShort !== undefined) {
            const isShort = req.query.isShort === 'true';
            if (isShort) {
                query.isShort = true;
            } else {
                // For regular news, include false OR missing/null
                query.$or = [
                    { isShort: false },
                    { isShort: { $exists: false } },
                    { isShort: null }
                ];
            }
        }

        let newsQuery = News.find(query).sort({ createdAt: -1 });

        // Limit results if provided
        if (limit) {
            newsQuery = newsQuery.limit(parseInt(limit));
        }

        const news = await newsQuery;
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new news
router.post('/', async (req, res) => {
    const news = new News({
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
        video: req.body.video,
        author: req.body.author
    });

    try {
        const newNews = await news.save();

        // Create Notification
        const notification = new Notification({
            message: `Breaking News: ${req.body.title}`,
            type: 'news',
            link: `/article/${newNews._id}`,
            image: req.body.image
        });
        await notification.save();

        res.status(201).json(newNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', getNewsById);
router.delete('/:id', deleteNews);

module.exports = router;
