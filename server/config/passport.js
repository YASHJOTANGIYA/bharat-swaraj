const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here') {

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.platform === 'win32'
                    ? '/api/auth/google/callback'
                    : 'https://bharat-swaraj.onrender.com/api/auth/google/callback',
                proxy: true
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // Force admin role for specific email if not already set
                        if (user.email === 'yashjotangiya0@gmail.com' && user.role !== 'admin') {
                            user.role = 'admin';
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Check if user exists with same email
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link Google account to existing user
                        user.googleId = profile.id;

                        // Force admin role for specific email
                        if (user.email === 'yashjotangiya0@gmail.com') {
                            user.role = 'admin';
                        }

                        await user.save();
                        return done(null, user);
                    }

                    // Create new user
                    const isAdmin = profile.emails[0].value === 'yashjotangiya0@gmail.com';
                    user = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        role: isAdmin ? 'admin' : 'user'
                    });

                    await user.save();
                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    console.log('✅ Google OAuth is configured and ready');
} else {
    console.log('⚠️  Google OAuth is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file.');
    console.log('📖 See GOOGLE_OAUTH_SETUP.md for instructions.');
}

module.exports = passport;
