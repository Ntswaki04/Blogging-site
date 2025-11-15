import './Blog.css';
import BlogCard from '../components/BlogCard';
import { postsAPI, getCurrentUser } from '../utils/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getCurrentUser();

  const handleWriteBlogClick = () => {
    if (!currentUser) {
      alert('Please login to create a blog post');
      navigate('/login');
      return;
    }
    navigate('/create');
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching blog posts...');
        const posts = await postsAPI.getAll();
        console.log('Posts fetched successfully:', posts);
        setBlogPosts(posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-container">
          <div className="loading">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
        <div className="blog-container">
          <div className="error-message">
            <h3>Error Loading Posts</h3>
            <p>{error}</p>
            <button 
              className="btn" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-container">
        <div className="blog-header">
          <div className="blog-header-content">
            <h1>Developer Blog</h1>
            <p>Insights, tutorials, and trends from our developer community</p>
          </div>
          <button 
            className="write-blog-btn"
            onClick={handleWriteBlogClick}
          >
            Write a Blog
          </button>
        </div>

        <div className="blog-grid">
          {blogPosts.map(post => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        {/* Empty state if no blogs */}
        {blogPosts.length === 0 && (
          <div className="no-blogs">
            <h3>No blog posts yet</h3>
            <p>Be the first to share your knowledge with the community!</p>
            <button 
              className="write-blog-btn"
              onClick={handleWriteBlogClick}
            >
              Write First Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;