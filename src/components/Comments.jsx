import './Comments.css';

const Comments = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return (
            <div className="comments">
                <p className="no-comments">No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="comments">
            {comments.map(comment => (
                <div key={comment._id || comment.id} className="comment">
                    <div className="comment-header">
                        <span className="comment-author">
                            {comment.author || comment.authorName || 'Anonymous'}
                        </span>
                        <span className="comment-date">
                            {new Date(comment.createdAt || comment.created_at || comment.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Comments;