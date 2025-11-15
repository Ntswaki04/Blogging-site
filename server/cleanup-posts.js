//File to purge Blog Posts

const mongoose = require('mongoose');
require('dotenv').config();

const cleanupPosts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devblog');
        console.log('Connected to MongoDB');

        const result = await mongoose.connection.db.collection('blogposts').deleteMany({});
        console.log(`Deleted ${result.deletedCount} blog posts`);

        console.log('Blog posts collection cleared successfully!');
        console.log('You can now create new posts with proper user associations');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

cleanupPosts();