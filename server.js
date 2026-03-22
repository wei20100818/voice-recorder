const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Auto-create 'uploads' folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }

// Setup how files are saved
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `voice_${Date.now()}.webm`)
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('public')); // This tells the server where the website is

// The route that receives the audio
app.post('/upload', upload.single('voiceNote'), (req, res) => {
    console.log(`Received: ${req.file.filename}`);
    res.status(200).json({ message: "Successfully saved to server!" });
});

app.listen(PORT, () => console.log(`Server live at http://localhost:${PORT}`));