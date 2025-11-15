import './CreateBlog.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI, getCurrentUser } from '../utils/api';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      alert('Please login to create a blog post');
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please login to create a blog post');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('content', formData.content);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Creating post with image:', formData.image ? 'Yes' : 'No');
      
      const createdPost = await postsAPI.create(formDataToSend);
      console.log('Post created successfully:', createdPost);
      
      alert('Blog post created successfully!');
      
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        image: null
      });
      setImagePreview(null);
      
      navigate('/blog');
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="create-blog-page">
        <div className="create-blog-container">
          <div className="loading">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-blog-page">
      <div className="create-blog-container">
        <div className="create-blog-header">
          <h1>Create A New Blog Post</h1>
          <p>Share your knowledge with our developer community</p>
          <p className="user-info">Posting as: {currentUser.name} {currentUser.surname}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="create-blog-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Blog Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your blog title"
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
                placeholder="A brief description of your post"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Featured Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                disabled={loading}
              />
              <label htmlFor="image" className="image-upload-label">
                Upload Featured Image
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({...formData, image: null});
                    }}
                    disabled={loading}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            <small className="image-hint">
              Max upload size: 5MB
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Blog Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog post content here..."
              rows="15"
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn publish-btn"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;