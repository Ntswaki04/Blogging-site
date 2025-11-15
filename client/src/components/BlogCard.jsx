import './BlogCard.css';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ post }) => {
    const navigate = useNavigate();

    const handleReadMore = () => {
        navigate(`/blog/${post._id}`);
    };

    const getAuthorName = () => {
        if (typeof post.author === 'string') {
            return post.author;
        }

        if (post.author?.name && post.author?.surname) {
            return `${post.author.name} ${post.author.surname}`;
        }
        
        return post.author?.username || 'Unknown';
    };

    return (
        <article className="blog-card">
            <div className="blog-image">
                <img 
                    src={post.imageUrl || '/images/default-blog.jpg'} 
                    alt={post.title}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>
            <div className="blog-content">
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-subtitle">{post.subtitle}</p>
                <div className="blog-meta">
                    <span className="author">By {getAuthorName()}</span>
                    <span className="date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <button 
                    className="read-more-btn"
                    onClick={handleReadMore}
                >
                    Read More
                </button>
            </div>
        </article>
    );
};

export default BlogCard;