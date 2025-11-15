const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const uploadImage = require('../utils/uploadImage');

router.get('/', async (req, res) => {
    try {
        console.log('Fetching all blog posts...');
        const posts = await BlogPost.find()
            .populate('author', 'name surname username email')
            .sort({ createdAt: -1 });

        console.log(`Found ${posts.length} posts`);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching blog post:', req.params.id);
        const post = await BlogPost.findById(req.params.id)
            .populate('author', 'name surname username email');

        if (!post) {
            console.log('Blog post not found:', req.params.id);
            return res.status(404).json({ error: 'Blog post not found' });
        }

        console.log('Blog post found:', post.title);
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, subtitle, content } = req.body;
        let imageUrl = '';

        console.log('Creating new blog post for user:', req.user._id);
        console.log('Post data:', { title, subtitle, contentLength: content?.length });

        if (req.file) {
            console.log('Uploading image...');
            const uploadResult = await uploadImage(req.file);
            imageUrl = uploadResult.url;
            console.log('Image uploaded:', imageUrl);
        }

        const newPost = new BlogPost({
            title,
            subtitle,
            content,
            imageUrl,
            author: req.user._id
        });

        await newPost.save();

        await newPost.populate('author', 'name surname username email');

        console.log('Blog post created successfully:', newPost._id);

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, subtitle, content } = req.body;

        console.log('Updating blog post:', req.params.id);
        console.log('Update data:', { title, subtitle, contentLength: content?.length });

        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            console.log('Blog post not found:', req.params.id);
            return res.status(404).json({ error: 'Blog post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            console.log('Access denied - user does not own post. User:', req.user._id, 'Post author:', post.author);
            return res.status(403).json({ error: 'Access denied. You can only edit your own posts.' });
        }

        post.title = title || post.title;
        post.subtitle = subtitle || post.subtitle;
        post.content = content || post.content;

        await post.save();

        await post.populate('author', 'name surname username email');

        console.log('Blog post updated successfully:', post._id);

        res.json({
            message: 'Blog post updated successfully',
            post
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        console.log('Deleting blog post:', req.params.id);

        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            console.log('Blog post not found:', req.params.id);
            return res.status(404).json({ error: 'Blog post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            console.log('Access denied - user does not own post. User:', req.user._id, 'Post author:', post.author);
            return res.status(403).json({ error: 'Access denied. You can only delete your own posts.' });
        }

        await BlogPost.findByIdAndDelete(req.params.id);

        console.log('Blog post deleted successfully:', req.params.id);

        res.json({
            message: 'Blog post deleted successfully',
            deletedPostId: req.params.id
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/image', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        console.log('Updating image for post:', req.params.id);

        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            console.log('Blog post not found:', req.params.id);
            return res.status(404).json({ error: 'Blog post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            console.log('Access denied - user does not own post');
            return res.status(403).json({ error: 'Access denied. You can only update your own posts.' });
        }

        let imageUrl = post.imageUrl;

        if (req.file) {
            console.log('Uploading new image...');
            const uploadResult = await uploadImage(req.file);
            imageUrl = uploadResult.url;
            console.log('New image uploaded:', imageUrl);
        }

        post.imageUrl = imageUrl;
        await post.save();

        await post.populate('author', 'name surname username email');

        console.log('Blog post image updated successfully:', post._id);

        res.json({
            message: 'Blog post image updated successfully',
            post
        });
    } catch (error) {
        console.error('Update image error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        
        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        
        res.json(blogPost.comments || []);
        
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, author } = req.body;

        console.log('Creating comment for post:', postId);
        console.log('Comment data:', { content, author });

        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
             console.log('Blog post not found:', postId);
            return res.status(404).json({ error: 'Blog post not found' });
        }

        const newComment = {
            content: content.trim(),
            author: author || 'Anonymous',
            createdAt: new Date()
        };

        if (!blogPost.comments) {
            blogPost.comments = [];
        }

        blogPost.comments.push(newComment);
        await blogPost.save();

        console.log('Comment created successfully for post:', postId)

        res.status(201).json(newComment);

     } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.delete('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        if (!blogPost.comments || blogPost.comments.length === 0) {
            return res.status(404).json({ error: 'No comments found' });
        }

        const commentIndex = blogPost.comments.findIndex(comment => 
            comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        blogPost.comments.splice(commentIndex, 1);
        await blogPost.save();

        res.json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;