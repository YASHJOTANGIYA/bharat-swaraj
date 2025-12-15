const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Notification = require('../models/Notification');
const { getNewsById, deleteNews } = require('../controllers/newsController');

// Get all news with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, limit, exclude, search, ids } = req.query;
        let query = {};
        const andConditions = [];

        // Filter by specific IDs
        if (ids) {
            const idList = ids.split(',');
            query._id = { $in: idList };
        }

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            andConditions.push({
                $or: [
                    { title: searchRegex },
                    { summary: searchRegex },
                    { content: searchRegex },
                    { category: searchRegex }
                ]
            });
        }

        // Filter by category if provided
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') }; // Case-insensitive match
        }

        // Exclude specific ID (useful for "Related News" to exclude current article)
        if (exclude) {
            if (query._id) {
                query._id.$ne = exclude;
            } else {
                query._id = { $ne: exclude };
            }
        }

        // Filter by isShort (true/false)
        if (req.query.isShort !== undefined) {
            const isShort = req.query.isShort === 'true';
            if (isShort) {
                query.isShort = true;
            } else {
                // For regular news, include false OR missing/null
                andConditions.push({
                    $or: [
                        { isShort: false },
                        { isShort: { $exists: false } },
                        { isShort: null }
                    ]
                });
            }
        }

        if (andConditions.length > 0) {
            query.$and = andConditions;
        }

        let sortOption = { createdAt: -1 };
        if (req.query.sort) {
            const sortField = req.query.sort.replace('-', '');
            const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
            sortOption = { [sortField]: sortOrder };
        }

        let newsQuery = News.find(query).sort(sortOption);

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limitVal = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limitVal;

        const totalNews = await News.countDocuments(query);
        const totalPages = Math.ceil(totalNews / limitVal);

        newsQuery = newsQuery.skip(skip).limit(limitVal);

        const news = await newsQuery;

        res.json({
            news,
            currentPage: page,
            totalPages,
            totalNews
        });
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
