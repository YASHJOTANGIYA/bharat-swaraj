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
    isShort: { type: Boolean, default: false }, // Identify if it's a YouTube Short
    createdAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
newsSchema.index({ createdAt: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ isShort: 1 });

module.exports = mongoose.model('News', newsSchema);
