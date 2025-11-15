import { useState } from 'react';
import { postsAPI, getCurrentUser } from '../utils/api';
import './CommentForm.css';

const CommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const currentUser = getCurrentUser();
    const defaultAuthor = currentUser ? `${currentUser.name} ${currentUser.surname}` : '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert('Please write a comment');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const commentData = {
                content: content.trim(),
                author: defaultAuthor || 'Anonymous',
                postId: postId
            };

            console.log('Submitting comment:', commentData);
            
            await postsAPI.addComment(postId, commentData);

            setContent('');

            if (onCommentAdded) {
                onCommentAdded();
            }

            alert('Comment submitted successfully!');
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('Failed to submit comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <h3 className="comment-form-title">Add a Comment</h3>
            
            {error && <div className="error-message">{error}</div>}

            {!currentUser && (
                <div className="form-group">
                    <label htmlFor="author" className="form-label">Name</label>
                    <input
                        type="text"
                        id="author"
                        className="form-input"
                        placeholder="Your name"
                        disabled
                        value="Anonymous (please login to use your name)"
                    />
                    <small className="form-help">Login to comment</small>
                </div>
            )}

            {currentUser && (
                <div className="form-group">
                    <label className="form-label">Commenting as</label>
                    <div className="user-badge">
                        {defaultAuthor}
                    </div>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="content" className="form-label">Comment *</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-textarea"
                    placeholder="Write your comment here..."
                    rows="4"
                    required
                    disabled={submitting}
                />
            </div>

            <button 
                type="submit" 
                className="submit-button"
                disabled={submitting || !content.trim()}
            >
                {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
        </form>
    );
};

export default CommentForm;