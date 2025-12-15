const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine resource type based on mimetype
        const isPdf = file.mimetype === 'application/pdf';
        return {
            folder: 'bharat-swaraj-uploads',
            resource_type: isPdf ? 'raw' : 'auto',
            // For raw files, we MUST manually include the extension in the public_id
            // otherwise Cloudinary serves it without one, and browsers/viewers get confused.
            public_id: file.originalname.split('.')[0] + '-' + Date.now() + (isPdf ? '.pdf' : ''),
            format: isPdf ? undefined : 'auto', // Don't set format for raw files
        };
    }
});

const upload = multer({ storage: storage });

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Cloudinary returns the URL in req.file.path
        res.json({ imageUrl: req.file.path });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

module.exports = router;
