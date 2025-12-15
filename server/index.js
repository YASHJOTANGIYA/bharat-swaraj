const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const passport = require('./config/passport');
const { scheduleYouTubeSync } = require('./scheduler/youtubeSync');
const { updateShortsStatus } = require('./routes/importYouTube');

const app = express();
// Trust proxy is required for Render/Heroku to correctly detect https protocol
app.enable('trust proxy');
const PORT = process.env.PORT || 5000;

// Middleware
// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://bharat-swaraj-8c29.vercel.app',
        'https://bharat-swaraj.vercel.app',
        'https://www.bharatswarajweekly.com',
        'https://bharatswarajweekly.com'
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());

// Database Connection
const mongoURI = process.env.MONGO_LIVE || process.env.MONGO_URI;

if (!mongoURI) {
    console.error('❌ MongoDB connection error: MONGO_LIVE or MONGO_URI is not defined in environment variables.');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB Connected');

        // Only run background schedulers if NOT in Vercel (Serverless)
        if (!process.env.VERCEL) {
            // Start YouTube auto-sync scheduler after DB connection
            scheduleYouTubeSync();

            // Run Shorts migration 10 seconds after startup
            setTimeout(() => {
                updateShortsStatus();
            }, 10000);
        }
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api', require('./routes/upload'));
app.use('/api/econtent', require('./routes/econtent'));
app.use('/api/general', require('./routes/general'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/import', require('./routes/importYouTube').router);

app.get('/', (req, res) => {
    res.send('Bharat Swaraj API is running');
});

// Start Server
if (process.env.VERCEL) {
    // Vercel Serverless Environment
    module.exports = app;
} else {
    // Local or Render (Persistent Server) Environment
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
