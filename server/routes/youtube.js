const express = require('express');
const router = express.Router();
const axios = require('axios');
const News = require('../models/News');
const Notification = require('../models/Notification');

// YouTube API Configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UClhHd2VV7i-aMEXV63La1Lw'; // @bharatswarajweekly2359

// Category detection based on keywords
const detectCategory = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();

    // Category keywords (English + Hindi + Gujarati)
    const categories = {
        politics: ['politics', 'election', 'government', 'minister', 'parliament', 'congress', 'bjp', 'राजनीति', 'चुनाव', 'सरकार', 'मंत्री', 'રાજનીતિ', 'ચૂંટણી', 'સરકાર', 'મંત્રી', 'સંસદ', 'કોંગ્રેસ', 'ભાજપ', 'નેતા'],
        sports: ['sports', 'cricket', 'football', 'match', 'player', 'tournament', 'खेल', 'क्रिकेट', 'मैच', 'રમત', 'ક્રિકેટ', 'મેચ', 'ખેલાડી'],
        entertainment: ['entertainment', 'movie', 'film', 'actor', 'actress', 'bollywood', 'मनोरंजन', 'फिल्म', 'सिनेमा', 'મનોરંજન', 'ફિલ્મ', 'સિનેમા', 'કલાકાર'],
        business: ['business', 'economy', 'market', 'stock', 'company', 'व्यापार', 'बाजार', 'अर्थव्यवस्था', 'વેપાર', 'બજાર', 'શેરબજાર', 'કંપની'],
        technology: ['technology', 'tech', 'smartphone', 'app', 'software', 'तकनीक', 'मोबाइल', 'ટેકનોલોજી', 'મોબાઈલ'],
        health: ['health', 'medical', 'doctor', 'hospital', 'disease', 'स्वास्थ्य', 'चिकित्सा', 'સ્વાસ્થ્ય', 'હોસ્પિટલ', 'ડૉક્ટર', 'રોગ'],
        education: ['education', 'school', 'college', 'university', 'exam', 'शिक्षा', 'परीक्षा', 'શિક્ષણ', 'શાળા', 'કોલેજ', 'પરીક્ષા'],
        crime: ['crime', 'police', 'arrest', 'murder', 'theft', 'अपराध', 'पुलिस', 'ગુનો', 'પોલીસ', 'ધરપકડ', 'હત્યા', 'ચોરી'],
        international: ['international', 'world', 'global', 'foreign', 'अंतरराष्ट्रीय', 'विश्व', 'આંતરરાષ્ટ્રીય', 'વિશ્વ', 'વિદેશ'],
        india: ['india', 'indian', 'bharat', 'भारत', 'देश', 'राष्ट्र', 'ભારત', 'દેશ']
    };

    // Check each category
    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                return category;
            }
        }
    }

    // Default to 'india' if no specific category found
    return 'india';
};

// Fetch videos from YouTube and convert to news articles
router.post('/sync-youtube', async (req, res) => {
    try {
        if (!YOUTUBE_API_KEY) {
            return res.status(500).json({
                message: 'YouTube API key not configured. Please add YOUTUBE_API_KEY to .env file'
            });
        }

        let imported = 0;
        let skipped = 0;
        const categoryCounts = {};
        let nextPageToken = '';
        let fetchedCount = 0;
        const MAX_VIDEOS_TO_FETCH = 50;

        // Loop to fetch multiple pages
        while (fetchedCount < MAX_VIDEOS_TO_FETCH) {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: YOUTUBE_API_KEY,
                    channelId: CHANNEL_ID,
                    part: 'snippet',
                    order: 'date',
                    maxResults: 10,
                    type: 'video',
                    pageToken: nextPageToken
                }
            });

            const videos = response.data.items;
            if (!videos || videos.length === 0) break;

            for (const video of videos) {
                const videoId = video.id.videoId;

                // Check if video already exists in database
                const existingNews = await News.findOne({ youtubeVideoId: videoId });
                if (existingNews) {
                    skipped++;
                    continue;
                }

                // Get video details
                const videoDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        key: YOUTUBE_API_KEY,
                        id: videoId,
                        part: 'snippet,contentDetails,statistics'
                    }
                });

                const videoData = videoDetails.data.items[0];
                const snippet = videoData.snippet;

                // Detect category
                const detectedCategory = detectCategory(snippet.title, snippet.description || '');
                categoryCounts[detectedCategory] = (categoryCounts[detectedCategory] || 0) + 1;

                // Create news article
                const newsArticle = new News({
                    title: snippet.title,
                    content: snippet.description || 'Watch the full video for details.',
                    category: detectedCategory,
                    image: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium.url,
                    youtubeVideoId: videoId,
                    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
                    views: parseInt(videoData.statistics.viewCount) || 0,
                    publishedAt: new Date(snippet.publishedAt),
                    createdAt: new Date(snippet.publishedAt)
                });

                await newsArticle.save();
                imported++;
            }

            fetchedCount += videos.length;
            nextPageToken = response.data.nextPageToken;

            if (!nextPageToken) break;
        }

        // Create notification if new videos were imported
        if (imported > 0) {
            await Notification.create({
                message: `${imported} new YouTube video${imported > 1 ? 's' : ''} imported`,
                type: 'news',
                link: '/'
            });
        }

        res.json({
            success: true,
            message: `YouTube sync completed. Imported: ${imported}, Skipped: ${skipped}`,
            imported,
            skipped,
            categoryCounts
        });

    } catch (error) {
        console.error('YouTube sync error:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Failed to sync YouTube videos',
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Re-categorize all existing YouTube videos
router.post('/recategorize-videos', async (req, res) => {
    try {
        const youtubeVideos = await News.find({ youtubeVideoId: { $exists: true, $ne: null } });

        let updated = 0;
        const categoryCounts = {};

        for (const video of youtubeVideos) {
            const newCategory = detectCategory(video.title, video.content || '');

            if (video.category !== newCategory) {
                video.category = newCategory;
                await video.save();
                updated++;
            }

            categoryCounts[newCategory] = (categoryCounts[newCategory] || 0) + 1;
        }

        res.json({
            success: true,
            message: `Re-categorization completed. Total videos: ${youtubeVideos.length}, Updated: ${updated}`,
            totalVideos: youtubeVideos.length,
            updated,
            categoryCounts
        });

    } catch (error) {
        console.error('Re-categorization error:', error);
        res.status(500).json({
            message: 'Failed to re-categorize videos',
            error: error.message
        });
    }
});

// Get YouTube channel info
router.get('/youtube-info', async (req, res) => {
    try {
        if (!YOUTUBE_API_KEY) {
            return res.status(500).json({
                message: 'YouTube API key not configured'
            });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                key: YOUTUBE_API_KEY,
                id: CHANNEL_ID,
                part: 'snippet,statistics'
            }
        });

        res.json(response.data.items[0]);
    } catch (error) {
        console.error('YouTube info error:', error);
        res.status(500).json({ message: 'Failed to fetch channel info' });
    }
});

module.exports = router;
