const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    author: { type: String },
    views: { type: Number, default: 0 },
    youtubeVideoId: { type: String }, // YouTube video ID
    youtubeUrl: { type: String }, // Full YouTube URL
    publishedAt: { type: Date }, // Original publish date from YouTube
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
