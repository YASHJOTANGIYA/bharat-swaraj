const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const passport = require('./config/passport');
const { scheduleYouTubeSync } = require('./scheduler/youtubeSync');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        // Start YouTube auto-sync scheduler after DB connection
        scheduleYouTubeSync();
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

app.get('/', (req, res) => {
    res.send('Bharat Swaraj API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
