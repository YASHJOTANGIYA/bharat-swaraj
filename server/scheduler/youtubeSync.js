const cron = require('node-cron');
const axios = require('axios');

// Schedule YouTube sync to run every 24 hours at 2:00 AM
const scheduleYouTubeSync = () => {
    // Run every day at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('🔄 Running scheduled YouTube sync...');

        try {
            const response = await axios.post('http://localhost:5000/api/youtube/sync-youtube');
            console.log('✅ YouTube sync completed:', response.data);
        } catch (error) {
            console.error('❌ YouTube sync failed:', error.message);
        }
    });

    console.log('⏰ YouTube auto-sync scheduled: Every day at 2:00 AM');

    // Optional: Run sync immediately on server start
    // setTimeout(async () => {
    //     console.log('🚀 Running initial YouTube sync...');
    //     try {
    //         const response = await axios.post('http://localhost:5000/api/youtube/sync-youtube');
    //         console.log('✅ Initial sync completed:', response.data);
    //     } catch (error) {
    //         console.error('❌ Initial sync failed:', error.message);
    //     }
    // }, 5000); // Wait 5 seconds after server starts
};

module.exports = { scheduleYouTubeSync };
