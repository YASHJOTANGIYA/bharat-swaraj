const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const Notification = require('../models/Notification');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'This email is already subscribed.' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: 'Thank you for subscribing! You will be notified when new content is added.' });
    } catch (err) {
        res.status(500).json({ message: 'Subscription failed. Please try again later.' });
    }
});

// Get all subscribers (Admin)
router.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a subscriber (Admin)
router.delete('/subscribers/:id', async (req, res) => {
    try {
        await Subscriber.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subscriber removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all notifications
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a notification (Internal use when adding news/econtent)
router.post('/notifications', async (req, res) => {
    try {
        const { message, type, link } = req.body;
        const newNotification = new Notification({ message, type, link });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const axios = require('axios');

// Get Live Gold Rate
router.get('/gold-rate', async (req, res) => {
    try {
        // Fetch from a public data source (GoldPrice.org)
        const response = await axios.get('https://data-asg.goldprice.org/dbXRates/INR', {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (response.data && response.data.items && response.data.items.length > 0) {
            const data = response.data.items[0];
            const goldOunce = data.xauPrice;
            const silverOunce = data.xagPrice;

            // Conversion: 1 Troy Ounce = 31.1034768 grams
            const gold10g = (goldOunce / 31.1034768) * 10;
            const silver1kg = (silverOunce / 31.1034768) * 1000;

            res.json({
                gold24k: gold10g,
                gold22k: gold10g * 0.916, // 22K is 91.6% purity
                silver1kg: silver1kg,
                currency: 'INR',
                timestamp: new Date()
            });
        } else {
            throw new Error('Invalid data format');
        }
    } catch (err) {
        console.error('Gold Rate Fetch Error:', err.message);
        // Fallback to static data if API fails
        res.json({
            gold24k: 76500,
            gold22k: 70150,
            silver1kg: 92000,
            isFallback: true
        });
    }
});

module.exports = router;
