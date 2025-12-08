const mongoose = require('mongoose');

const eContentSchema = new mongoose.Schema({
    city: { type: String, required: true },
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EContent', eContentSchema);
