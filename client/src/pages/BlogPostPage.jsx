import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';
import CommentForm from '../components/CommentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { postsAPI, getCurrentUser } from '../utils/api';
import './BlogPostPage.css';

const BlogPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        fetchPostAndComments();
    }, [id]);

    const fetchPostAndComments = async () => {
        try {
            setLoading(true);
            
            if (id) {
                const postData = await postsAPI.getById(id);
                setPost(postData);
                await fetchComments();
            } else {
                setError('Invalid post ID');
            }
        } catch (err) {
            setError('Post not found');
            console.error('Error fetching post:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const commentsData = await postsAPI.getComments(id);
            setComments(commentsData || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleCommentAdded = async () => {
        await fetchComments();
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            await postsAPI.delete(post._id);
            alert('Post deleted successfully!');
            navigate('/blog');
        } catch (err) {
            setError('Failed to delete post');
            console.error('Error deleting post:', err);
        }
    };

    const isAuthor = currentUser && post && post.author && post.author._id === currentUser.id;

    if (loading) {
        return (
            <div className="blog-post-loading">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="blog-post-error">
                <div className="error-content">
                    <h1 className="error-title">
                        {error ? 'Error Loading Post' : 'Post Not Found'}
                    </h1>
                    <p className="error-message">
                        {error || 'The blog post you are looking for does not exist.'}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="back-btn"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-post-page">
            <div className="home-container">
                <button
                    onClick={() => navigate('/blog')}
                    className="back-btn"
                >
                    ← Back to Posts
                </button>

                <article className="blog-post">
                    <header className="post-header">
                        <div className="post-meta">
                            <div className="meta-item">
                                <span className="post-date">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            {post.author && (
                                <div className="meta-item">
                                    <span className="post-author">
                                        By {post.author.name && post.author.surname 
                                            ? `${post.author.name} ${post.author.surname}`
                                            : post.author.username || 'Unknown Author'
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <h1 className="post-title">
                            {post.title}
                        </h1>
                        {post.subtitle && (
                            <p className="post-subtitle">{post.subtitle}</p>
                        )}
                    </header>

                    {post.imageUrl && (
                        <div className="post-image-container">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="post-image"
                            />
                        </div>
                    )}

                    <div className="post-content">
                        {post.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="post-paragraph">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {isAuthor && (
                        <div className="post-actions">
                            <button 
                                className="btn-edit"
                                onClick={() => navigate(`/edit/${post._id}`)}
                            >
                                Edit Post
                            </button>
                            <button 
                                className="btn-delete"
                                onClick={handleDeletePost}
                            >
                                Delete Post
                            </button>
                        </div>
                    )}

                    <div className="comments-section">
                        <h2 className="comments-title">
                            Comments ({comments.length})
                        </h2>
                        
                        {commentsLoading ? (
                            <div className="comments-loading">
                                <LoadingSpinner />
                                <p>Loading comments...</p>
                            </div>
                        ) : (
                            <>
                                <Comments comments={comments} />
                                <CommentForm 
                                    postId={post._id} 
                                    onCommentAdded={handleCommentAdded} 
                                />
                            </>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;