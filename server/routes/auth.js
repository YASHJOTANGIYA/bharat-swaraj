const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { register, login, googleCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes - only if credentials are configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here';

if (isGoogleConfigured) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login?error=Authentication failed' }),
        googleCallback
    );
} else {
    // Fallback routes when Google OAuth is not configured
    router.get('/google', (req, res) => {
        res.status(503).json({ message: 'Google OAuth is not configured. Please add credentials to .env file.' });
    });

    router.get('/google/callback', (req, res) => {
        res.redirect('http://localhost:5173/login?error=Google OAuth not configured');
    });
}

module.exports = router;
