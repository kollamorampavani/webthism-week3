import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadPost = async () => {
        try {
            const response = await API.get(`/posts/${id}`);
            setPost(response.data.post);
            setComments(response.data.comments);
        } catch (err) {
            console.error(err);
            setError('Unable to load post.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPost();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!commentText.trim()) {
            setError('Enter a comment before submitting.');
            return;
        }

        try {
            await API.post(`/posts/${id}/comments`, { content: commentText });
            setCommentText('');
            loadPost();
        } catch (err) {
            setError(err.response?.data?.error || 'Unable to add comment');
        }
    };

    const handleBack = () => {
        navigate('/posts');
    };

    if (loading) {
        return <div className="post-detail-page"><div className="loading-state">Loading post...</div></div>;
    }

    if (error && !post) {
        return (
            <div className="post-detail-page">
                <div className="error-state">{error}</div>
                <button onClick={handleBack} className="detail-back">Back to posts</button>
            </div>
        );
    }

    return (
        <div className="post-detail-page">
            <div className="detail-header">
                <div>
                    <h1>{post.title}</h1>
                    <div className="detail-meta">
                        <span>By {post.author}</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <button onClick={handleBack} className="detail-back">Back to posts</button>
            </div>

            <div className="detail-content">
                <p>{post.content}</p>
            </div>

            <section className="comments-section">
                <h2>Comments</h2>
                {comments.length === 0 ? (
                    <p className="empty-state">No comments yet. Be the first to share feedback.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-card">
                            <div className="comment-header">
                                <span>{comment.author}</span>
                                <span>{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    ))
                )}
            </section>

            <section className="comment-form-section">
                {user ? (
                    <>
                        <h2>Add a comment</h2>
                        {error && <div className="form-error">{error}</div>}
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                rows="4"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment..."
                            />
                            <button type="submit">Post comment</button>
                        </form>
                    </>
                ) : (
                    <div className="login-prompt">
                        <p>You need to be logged in to post a comment.</p>
                        <Link to="/login" className="detail-login-link">Log in</Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PostDetail;
