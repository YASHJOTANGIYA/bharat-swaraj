const express = require('express');
const router = express.Router();
const axios = require('axios');
const News = require('../models/News');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = '@bharatswarajweekly';

// ... (existing code) ...

// Update isShort status for all existing videos
const updateShortsStatus = async () => {
    try {
        console.log('🔄 Starting Shorts status update migration...');
        const videos = await News.find({
            youtubeVideoId: { $exists: true, $ne: null },
            isShort: { $exists: false } // Only update if missing
        });

        if (videos.length === 0) {
            console.log('✅ No videos need Shorts status update.');
            return;
        }

        console.log(`found ${videos.length} videos to check for Shorts status.`);

        // Process in batches of 50 (YouTube API limit)
        for (let i = 0; i < videos.length; i += 50) {
            const batch = videos.slice(i, i + 50);
            const videoIds = batch.map(v => v.youtubeVideoId).join(',');

            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        key: YOUTUBE_API_KEY,
                        id: videoIds,
                        part: 'contentDetails'
                    }
                });

                if (!response.data.items) continue;

                for (const item of response.data.items) {
                    const duration = item.contentDetails.duration;
                    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                    const hours = (parseInt(match[1]) || 0);
                    const minutes = (parseInt(match[2]) || 0);
                    const seconds = (parseInt(match[3]) || 0);
                    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                    const isShort = totalSeconds <= 60;

                    await News.updateOne(
                        { youtubeVideoId: item.id },
                        { $set: { isShort: isShort } }
                    );
                }
                console.log(`✅ Processed batch ${i / 50 + 1}`);
            } catch (err) {
                console.error('Error processing batch:', err.message);
            }
        }
        console.log('✅ Shorts status update completed.');
    } catch (error) {
        console.error('❌ Shorts migration failed:', error);
    }
};

module.exports = { router, updateShortsStatus };
