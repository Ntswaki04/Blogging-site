import './Header.css';
import { getCurrentUser, logout } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <h2>DevBlog</h2>
                    </Link>
                </div>
                
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/blog" className="nav-link">Blog</Link>
                    {currentUser && (
                        <Link to="/create" className="nav-link">Write Post</Link>
                    )}
                </nav>
                
                <div className="header-actions">
                    {currentUser ? (
                        <>
                            <span className="user-greeting">
                                Hello, {currentUser.name}
                            </span>
                            <button 
                                className="header-login-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-login-btn">Login</Link>
                            <Link to="/signup" className="header-signup-btn">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;