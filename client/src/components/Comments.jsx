import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, User } from 'lucide-react';
import { toast } from 'react-toastify';
import './Comments.css';

const Comments = ({ newsId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchComments();
    }, [newsId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/comments/${newsId}`);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await axios.post('http://localhost:5000/api/comments', {
                newsId,
                userId: user.id || user._id,
                username: user.username,
                content: newComment
            });
            setComments([res.data, ...comments]);
            setNewComment('');
            toast.success('Comment added successfully');
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comments-section">
            <h3 className="comments-title">
                <MessageSquare size={20} />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="comment-form-container">
                {user ? (
                    <form onSubmit={handleSubmit} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="comment-input"
                            rows="3"
                        />
                        <button
                            type="submit"
                            className="comment-submit-btn"
                            disabled={submitting || !newComment.trim()}
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                            <Send size={16} />
                        </button>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p>Please <a href="/login">login</a> to join the discussion.</p>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <p className="loading-text">Loading comments...</p>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-avatar">
                                <User size={20} />
                            </div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.username}</span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="comment-text">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
};

export default Comments;
