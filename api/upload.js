const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => {
            const userId = req.body.userId || 'anonymous';
            return `voice-notes/${userId}`;
        },
        resource_type: 'video',
    },
});

const upload = multer({ storage: storage });

// Match native vercel routing which often strips the path
app.post(['/api/upload', '/upload', '/'], upload.single('voiceNote'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const userId = req.body.userId || 'anonymous';
    res.status(200).json({
        message: "Sent to Cloud!",
        userId: userId,
        folder: `voice-notes/${userId}`,
        url: req.file.path
    });
});

module.exports = app;

module.exports.config = {
    api: {
        bodyParser: false
    }
};
