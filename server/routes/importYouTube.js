const express = require('express');
const router = express.Router();
const axios = require('axios');
const News = require('../models/News');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = '@bharatswarajweekly2359';

// Category detection
const detectCategory = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();

    const categories = {
        politics: ['politics', 'election', 'government', 'minister', 'પોલીસ', 'સરકાર', 'રાજકારણ'],
        crime: ['police', 'arrest', 'accident', 'crime', 'પોલીસ', 'અકસ્માત', 'ધરપકડ', 'હાઇવે'],
        sports: ['sports', 'cricket', 'football', 'રમત', 'ક્રિકેટ'],
        entertainment: ['entertainment', 'movie', 'film', 'મનોરંજન'],
        india: ['india', 'indian', 'ભારત', 'રાજકોટ', 'ગુજરાત', 'સુરત']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                return category;
            }
        }
    }

    return 'india';
};

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Import route is working!',
        apiKey: YOUTUBE_API_KEY ? 'API Key is set' : 'API Key is missing',
        channelHandle: CHANNEL_HANDLE
    });
});

// Import latest videos from channel
router.post('/import-channel', async (req, res) => {
    try {
        console.log('🎬 Starting YouTube channel import...');

        // Step 1: Get channel ID from handle
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: YOUTUBE_API_KEY,
                q: CHANNEL_HANDLE,
                type: 'channel',
                part: 'snippet',
                maxResults: 1
            }
        });

        if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Channel not found'
            });
        }

        const channelId = searchResponse.data.items[0].id.channelId;
        console.log('✅ Found channel ID:', channelId);

        // Step 2: Get latest videos from channel
        const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: YOUTUBE_API_KEY,
                channelId: channelId,
                part: 'snippet',
                order: 'date',
                type: 'video',
                maxResults: 20 // Import last 20 videos
            }
        });

        if (!videosResponse.data.items) {
            return res.status(404).json({
                success: false,
                message: 'No videos found'
            });
        }

        const results = [];
        console.log(`📹 Found ${videosResponse.data.items.length} videos`);

        // Step 3: Import each video
        for (const item of videosResponse.data.items) {
            const videoId = item.id.videoId;
            const snippet = item.snippet;

            // Check if already exists
            const existing = await News.findOne({ youtubeVideoId: videoId });
            if (existing) {
                results.push({
                    videoId,
                    title: snippet.title,
                    status: 'skipped',
                    message: 'Already exists'
                });
                continue;
            }

            // Get detailed video info
            const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    key: YOUTUBE_API_KEY,
                    id: videoId,
                    part: 'snippet,statistics,contentDetails'
                }
            });

            if (!detailsResponse.data.items || detailsResponse.data.items.length === 0) {
                continue;
            }

            const videoData = detailsResponse.data.items[0];
            const videoSnippet = videoData.snippet;
            const category = detectCategory(videoSnippet.title, videoSnippet.description || '');

            // Check if video is a Short (duration <= 60 seconds)
            const duration = videoData.contentDetails.duration;
            const isShort = (duration) => {
                const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                const hours = (parseInt(match[1]) || 0);
                const minutes = (parseInt(match[2]) || 0);
                const seconds = (parseInt(match[3]) || 0);
                const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                return totalSeconds <= 60;
            };

            // Create news article
            const newsArticle = new News({
                title: videoSnippet.title,
                content: videoSnippet.description || 'Watch the full video for details.',
                category: category,
                image: videoSnippet.thumbnails.maxres?.url ||
                    videoSnippet.thumbnails.high?.url ||
                    videoSnippet.thumbnails.medium.url,
                youtubeVideoId: videoId,
                youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
                views: parseInt(videoData.statistics.viewCount) || 0,
                publishedAt: new Date(videoSnippet.publishedAt),
                isShort: isShort(duration),
                createdAt: new Date()
            });

            await newsArticle.save();

            results.push({
                videoId,
                title: videoSnippet.title,
                category: category,
                status: 'imported'
            });

            console.log(`✅ Imported: ${videoSnippet.title}`);
        }

        const imported = results.filter(r => r.status === 'imported').length;
        const skipped = results.filter(r => r.status === 'skipped').length;

        res.json({
            success: true,
            message: `Import complete! ${imported} videos imported, ${skipped} skipped`,
            imported: imported,
            skipped: skipped,
            details: results
        });

    } catch (error) {
        console.error('❌ Import error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to import videos',
            error: error.message
        });
    }
});

// Browser-friendly GET endpoint (same as POST)
router.get('/import-channel', async (req, res) => {
    try {
        console.log('🎬 Starting YouTube channel import (GET)...');

        // Step 1: Get channel ID from handle
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: YOUTUBE_API_KEY,
                q: CHANNEL_HANDLE,
                type: 'channel',
                part: 'snippet',
                maxResults: 1
            }
        });

        if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Channel not found'
            });
        }

        const channelId = searchResponse.data.items[0].id.channelId;
        console.log('✅ Found channel ID:', channelId);

        // Step 2: Get latest videos from channel
        const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: YOUTUBE_API_KEY,
                channelId: channelId,
                part: 'snippet',
                order: 'date',
                type: 'video',
                maxResults: 20
            }
        });

        if (!videosResponse.data.items) {
            return res.status(404).json({
                success: false,
                message: 'No videos found'
            });
        }

        const results = [];
        console.log(`📹 Found ${videosResponse.data.items.length} videos`);

        // Step 3: Import each video
        for (const item of videosResponse.data.items) {
            const videoId = item.id.videoId;
            const snippet = item.snippet;

            const existing = await News.findOne({ youtubeVideoId: videoId });
            if (existing) {
                results.push({
                    videoId,
                    title: snippet.title,
                    status: 'skipped',
                    message: 'Already exists'
                });
                continue;
            }

            const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    key: YOUTUBE_API_KEY,
                    id: videoId,
                    part: 'snippet,statistics,contentDetails'
                }
            });

            if (!detailsResponse.data.items || detailsResponse.data.items.length === 0) {
                continue;
            }

            const videoData = detailsResponse.data.items[0];
            const videoSnippet = videoData.snippet;
            const category = detectCategory(videoSnippet.title, videoSnippet.description || '');

            // Check if video is a Short (duration <= 60 seconds)
            const duration = videoData.contentDetails.duration;
            const isShort = (duration) => {
                const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                const hours = (parseInt(match[1]) || 0);
                const minutes = (parseInt(match[2]) || 0);
                const seconds = (parseInt(match[3]) || 0);
                const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                return totalSeconds <= 60;
            };

            const newsArticle = new News({
                title: videoSnippet.title,
                content: videoSnippet.description || 'Watch the full video for details.',
                category: category,
                image: videoSnippet.thumbnails.maxres?.url ||
                    videoSnippet.thumbnails.high?.url ||
                    videoSnippet.thumbnails.medium.url,
                youtubeVideoId: videoId,
                youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
                views: parseInt(videoData.statistics.viewCount) || 0,
                publishedAt: new Date(videoSnippet.publishedAt),
                isShort: isShort(duration),
                createdAt: new Date()
            });

            await newsArticle.save();

            results.push({
                videoId,
                title: videoSnippet.title,
                category: category,
                status: 'imported'
            });

            console.log(`✅ Imported: ${videoSnippet.title}`);
        }

        const imported = results.filter(r => r.status === 'imported').length;
        const skipped = results.filter(r => r.status === 'skipped').length;

        res.json({
            success: true,
            message: `Import complete! ${imported} videos imported, ${skipped} skipped`,
            imported: imported,
            skipped: skipped,
            details: results
        });

    } catch (error) {
        console.error('❌ Import error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to import videos',
            error: error.message
        });
    }
});

module.exports = router;
