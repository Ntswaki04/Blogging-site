import './Home.css';
import BlogCard from '../components/BlogCard';
import { postsAPI, getCurrentUser } from '../utils/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUser = getCurrentUser();

    const handleWriteBlogClick = () => {
        if (!currentUser) {
            alert('Please login to create a blog post');
            navigate('/login');
            return;
        }
        navigate('/create');
    };

    const handleViewAllBlogs = () => {
        navigate('/blog');
    };

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                setLoading(true);
                const posts = await postsAPI.getAll();
                
                const recentPosts = posts.slice(0, 3);
                setBlogPosts(recentPosts);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentPosts();
    }, []);

    return (
        <div className="home">
            <section className="hero-banner">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>Fueling the Future of Tech</h1>
                    </div>
                </div>
            </section>
            
            <section className="hero-description-section">
                <div className="description-container">
                    <p className="hero-subtitle">Where developers and tech thinkers publish, learn and connect.</p>
                    <p className="hero-description">
                        Whether you are sharing deep-dive tutorials, hot takes, or innovative concepts, this is the platform built for creators who push boundaries. Publish with ease, engage with a thriving tech community, and shape the conversations that define tomorrow.
                    </p>
                </div>
            </section>
            
            {/* Recent Blog Posts */}
            <section className="recent-posts">
                <div className="home-container">
                    <div className="section-header-home">
                        <h2>Recent Blog Posts</h2>
                        <button 
                            className="write-blog-btn"
                            onClick={handleWriteBlogClick}
                        >
                            Write Blog
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="loading">Loading recent posts...</div>
                    ) : (
                        <div className="home-blog-grid">
                            {blogPosts.map(post => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}

                    {!loading && blogPosts.length === 0 && (
                        <div className="no-posts">
                            <p>No blog posts yet. Be the first to write one!</p>
                        </div>
                    )}

                    {/* Add View All Blogs button */}
                    {blogPosts.length > 0 && (
                        <div className="view-all-container">
                            <button 
                                className="view-all-btn"
                                onClick={handleViewAllBlogs}
                            >
                                View All Posts →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;