const express = require('express');
const router = express.Router();
const EContent = require('../models/EContent');
const Notification = require('../models/Notification');

// Get all e-content for a city
router.get('/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const eContents = await EContent.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } }).sort({ date: -1 });
        res.json(eContents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new e-content
router.post('/', async (req, res) => {
    try {
        const { city, title, pdfUrl, date } = req.body;
        const newEContent = new EContent({
            city,
            title,
            pdfUrl,
            date: date || Date.now()
        });
        const savedEContent = await newEContent.save();

        // Create Notification
        const notification = new Notification({
            message: `New E-Paper added for ${city}: ${title}`,
            type: 'econtent',
            link: `/e-content/${city.toLowerCase()}`
        });
        await notification.save();

        res.status(201).json(savedEContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
