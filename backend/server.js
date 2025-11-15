const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ntsoaki2:nc900914@development1.yhuua5i.mongodb.net/devblog';

console.log('Attempting MongoDB connection...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
    })
    .catch((error) => {
        console.log('MongoDB connection failed:', error.message);
        console.log('But server will continue running...');
    });
app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    let statusText = 'Unknown';

    // Connection state codes
    if (dbStatus === 1) {
        statusText = 'Connected';
    } else if (dbStatus === 2) {
        statusText = 'Connecting...';
    } else {
        statusText = 'Disconnected';
    }

    res.json({
        message: 'Dev Blog API is running!',
        database: statusText,
        connection_state: dbStatus,
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});