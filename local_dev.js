const express = require('express');
const uploadApp = require('./api/upload.js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use('/api', uploadApp);

// Emulate Vercel Static routing
app.use(express.static('public'));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/user/:id/record', (req, res) => res.sendFile(path.join(__dirname, 'public', 'record.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Local dev server running on port ${PORT}`);
    console.log(`Make sure to also run 'fastapi dev api/index.py' on port 8000 for Python features locally!`);
});
