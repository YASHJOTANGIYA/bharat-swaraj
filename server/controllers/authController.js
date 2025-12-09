const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
    try {
        // User is available in req.user from passport
        const user = req.user;

        // Determine client URL based on environment
        // Force HTTPS for production/Render
        const clientUrl = (process.env.NODE_ENV === 'production' || process.env.RENDER)
            ? 'https://bharat-swaraj.vercel.app'
            : (process.env.CLIENT_URL || 'http://localhost:5173');

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Redirect to frontend with token
        res.redirect(`${clientUrl}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, username: user.username, email: user.email, role: user.role }))}`);
    } catch (err) {
        const clientUrl = (process.env.NODE_ENV === 'production' || process.env.RENDER)
            ? 'https://bharat-swaraj.vercel.app'
            : (process.env.CLIENT_URL || 'http://localhost:5173');
        res.redirect(`${clientUrl}/login?error=Authentication failed`);
    }
};

