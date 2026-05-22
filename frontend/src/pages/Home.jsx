import { useContext } from 'react';
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
                        Ready to write, {user.username}?
                    </div>
                ) : (
                    <div className="cta-container">
                        <p>Log in or sign up to create your first post.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
