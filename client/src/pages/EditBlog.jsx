import './EditBlog.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI, getCurrentUser } from '../utils/api';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        content: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            alert('Please login to edit blog posts');
            navigate('/login');
            return;
        }
        setCurrentUser(user);
        fetchPost();
    }, [id, navigate]);

    const fetchPost = async () => {
        try {
            const postData = await postsAPI.getById(id);
            
            if (postData.author._id !== getCurrentUser()?.id) {
                alert('You can only edit your own posts');
                navigate('/blog');
                return;
            }
            
            setPost(postData);
            setFormData({
                title: postData.title,
                subtitle: postData.subtitle || '',
                content: postData.content,
                image: null
            });
        } catch (err) {
            setError('Failed to load post');
            console.error('Error fetching post:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await postsAPI.update(id, formData);
            alert('Blog post updated successfully!');
            navigate(`/blog/${id}`);
        } catch (err) {
            setError(err.message || 'Failed to update blog post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            await postsAPI.delete(id);
            alert('Blog post deleted successfully!');
            navigate('/blog');
        } catch (err) {
            setError(err.message || 'Failed to delete blog post');
        }
    };

    if (!currentUser || !post) {
        return (
            <div className="edit-blog-page">
                <div className="edit-blog-container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-blog-page">
            <div className="edit-blog-container">
                <div className="edit-blog-header">
                    <h1>Edit Blog Post</h1>
                    <p>Make changes to your blog post</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="edit-blog-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Blog Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subtitle">Subtitle</label>
                        <input
                            type="text"
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Blog Content *</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="15"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Post'}
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn-danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Delete Post
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => navigate('/blog')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;