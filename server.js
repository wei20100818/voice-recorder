const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path'); // Add this!

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
            // userId will be sent from frontend in the FormData (must be appended before file)
            const userId = req.body.userId || 'anonymous';
            return `voice-notes/${userId}`;
        },
        resource_type: 'video',
    },
});

const upload = multer({ storage: storage });

// VERCEL FIX: Manually serve the index.html for the home route
app.use(express.static('public', { index: false })); // Exclude automatic index serving so we can manually handle routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/user/:id/record', (req, res) => res.sendFile(path.join(__dirname, 'public', 'record.html')));

app.post('/api/upload', upload.single('voiceNote'), (req, res) => {
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

// For Vercel, we don't strictly need app.listen, but it doesn't hurt.
// The export is what matters most.
const PORT = process.env.PORT || 3000;
// Export the app for Vercel
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Multi-Page Router enabled)`);
    });
}

module.exports = app;