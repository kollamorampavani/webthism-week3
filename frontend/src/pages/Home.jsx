import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to BlogCMS</h1>
                <p>Your premium space for writing and sharing ideas.</p>
                {user ? (
                    <div className="welcome-banner">
                        Ready to create a new post, {user.username}?
                    </div>
                ) : (
                    <div className="cta-container">
                        <p>Log in or sign up to share your first story.</p>
                    </div>
                )}
                <div className="action-group">
                    <Link to="/posts" className="home-btn">Browse posts</Link>
                    {user ? <Link to="/posts" className="home-btn home-btn-secondary">Create a post</Link> : null}
                </div>
            </div>
        </div>
    );
};

export default Home;
