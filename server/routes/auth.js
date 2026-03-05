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
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/callback', (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user, info) => {
            const clientUrl = process.env.CLIENT_URL || ((process.env.NODE_ENV === 'production' || process.env.RENDER)
                ? 'https://www.bharatswarajweekly.com'
                : 'http://localhost:5173');

            if (err) {
                console.error('Google Auth Error:', err);
                return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Google Auth Error: ' + err.message)}`);
            }
            if (!user) {
                return res.redirect(`${clientUrl}/login?error=Authentication failed`);
            }
            req.user = user;
            next();
        })(req, res, next);
    }, googleCallback);
} else {
    // Fallback routes when Google OAuth is not configured
    router.get('/google', (req, res) => {
        res.status(503).json({ message: 'Google OAuth is not configured. Please add credentials to .env file.' });
    });

    router.get('/google/callback', (req, res) => {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/login?error=Google OAuth not configured`);
    });
}

module.exports = router;
