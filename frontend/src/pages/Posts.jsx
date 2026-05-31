import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Posts.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const loadPosts = async () => {
        try {
            const response = await API.get('/posts');
            setPosts(response.data);
        } catch (err) {
            console.error(err);
            setError('Unable to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !content.trim()) {
            setError('Please add both a title and content.');
            return;
        }

        try {
            await API.post('/posts', { title, content });
            setTitle('');
            setContent('');
            loadPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        }
    };

    return (
        <div className="posts-page">
            <div className="posts-hero">
                <div>
                    <h1>All Posts</h1>
                    <p>Read community stories or share your own idea in just a few clicks.</p>
                </div>
                <Link to="/" className="posts-back">Home</Link>
            </div>

            {user && (
                <section className="create-post-card">
                    <h2>Create a new post</h2>
                    {error && <div className="form-error">{error}</div>}
                    <form onSubmit={handleSubmit} className="post-form">
                        <input
                            type="text"
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            rows="6"
                            placeholder="What do you want to share today?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button type="submit">Publish Post</button>
                    </form>
                </section>
            )}

            <section className="posts-list">
                {loading ? (
                    <div className="loading-state">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">
                        No posts found yet. {user ? 'Create one to get started.' : 'Log in to add a post.'}
                    </div>
                ) : (
                    posts.map((post) => (
                        <article key={post.id} className="post-card">
                            <div className="post-card-header">
                                <h3>{post.title}</h3>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            <p>{post.content.length > 180 ? `${post.content.slice(0, 180)}...` : post.content}</p>
                            <div className="post-card-meta">
                                <span>By {post.author}</span>
                                <span>{post.comment_count} comments</span>
                            </div>
                            <Link to={`/posts/${post.id}`} className="post-link">Read more</Link>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
};

export default Posts;
