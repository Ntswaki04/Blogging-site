const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://blogging-site-client.onrender.com'
    ],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is required');
    process.exit(1);
}

console.log('Attempting MongoDB connection...');

mongoose.connect(MONGODB_URI) 
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
    })
    .catch((error) => {
        console.log('MongoDB connection failed:', error.message);
        console.log('But server will continue running...');
    });

mongoose.connection.on('error', err => {
    console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});


app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    let statusText = 'Unknown';

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