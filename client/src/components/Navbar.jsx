import React from 'react';
import { Search, User, Bell, ShieldCheck, Newspaper, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Navbar.css';
const Navbar = () => {
    const [user, setUser] = React.useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkUser();

        const handleStorageChange = () => {
            checkUser();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    React.useEffect(() => {
        // Check for redirect action whenever location changes
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('action') === 'econtent') {
            // Clear the query param
            window.history.replaceState({}, '', '/');
            // We need to wait for user state to be set, but it should be synchronous from localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setShowCityModal(true);
            }
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
    };

    const [showCityModal, setShowCityModal] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCity, setSelectedCity] = React.useState(null);
    const [loginStep, setLoginStep] = React.useState('none'); // 'none', 'landing'

    const cities = [
        'Ahmedabad', 'NRG', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
        'Gandhinagar', 'Mehsana', 'Anand', 'Jamnagar', 'Junagadh',
        'Surendranagar', 'Navsari', 'Mumbai', 'Valsad', 'Bharuch',
        'Amreli', 'Banaskantha (Palanpur)', 'Kutch (Bhuj)'
    ];

    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEContentClick = () => {
        if (user) {
            navigate('/e-content/rajkot');
        } else {
            setLoginStep('landing');
        }
    };

    const handleLoginToRead = () => {
        setLoginStep('none');
        navigate('/login?redirect=econtent');
    };

    const closeAllModals = () => {
        setLoginStep('none');
        setShowCityModal(false);
    };

    const handleCitySubmit = () => {
        if (selectedCity) {
            closeAllModals();
            navigate(`/e-content/${selectedCity.toLowerCase()}`);
        }
    };

    const [notifications, setNotifications] = React.useState([]);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [lastNotificationId, setLastNotificationId] = React.useState(null);
    const [hasFetched, setHasFetched] = React.useState(false);

    React.useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 3 seconds
        const interval = setInterval(fetchNotifications, 3000);
        return () => clearInterval(interval);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/general/notifications?t=${new Date().getTime()}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);

                if (data.length > 0) {
                    const latest = data[0];
                    // Show toast only if it's not the first fetch and the ID is new
                    if (hasFetched && (!lastNotificationId || latest._id !== lastNotificationId)) {
                        toast(
                            <div className="mac-notification-container" onClick={() => navigate(latest.link)}>
                                <div className="mac-image-container">
                                    {latest.image ? (
                                        <img src={`http://localhost:5000${latest.image}`} alt="" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                    ) : null}
                                    <Newspaper size={24} style={{ display: latest.image ? 'none' : 'block' }} />
                                </div>
                                <div className="mac-content">
                                    <div className="mac-title">Bharat Swaraj</div>
                                    <p className="mac-message">{latest.message}</p>
                                </div>
                            </div>,
                            {
                                className: 'mac-toast dark-theme-toast',
                                bodyClassName: 'mac-toast-body',
                                hideProgressBar: true,
                                closeButton: false,
                                autoClose: 5000,
                                position: "top-right"
                            }
                        );
                    }
                    setLastNotificationId(latest._id);
                }
                setHasFetched(true);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleNotificationClick = () => {
        if (!showNotifications) {
            fetchNotifications(); // Fetch fresh notifications when opening
        }
        setShowNotifications(!showNotifications);
    };

    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <>
            <nav className="navbar">
                {/* Left Section */}
                <div className="navbar-left">
                    <Link to="/" className="navbar-logo">
                        <img
                            src="/logo.png"
                            alt="Bharat Swaraj"
                            className="navbar-logo-image"
                        />
                    </Link>
                </div>

                {/* Center Section */}
                <div className="navbar-search-container">
                    <form onSubmit={handleSearch} className="navbar-search-wrapper">
                        <input
                            type="text"
                            placeholder="Search for news, topics..."
                            className="navbar-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} className="navbar-search-icon" />
                    </form>
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    <button onClick={handleEContentClick} className="navbar-econtent-btn">
                        <Newspaper size={18} />
                        <span>E-Content</span>
                    </button>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="navbar-admin-link">
                            <ShieldCheck size={18} />
                            <span>Admin</span>
                        </Link>
                    )}

                    <div className="notification-wrapper">
                        <button className="navbar-bell-btn" onClick={handleNotificationClick}>
                            <Bell size={22} />
                            {notifications.length > 0 && <span className="navbar-notification-dot"></span>}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="notification-header">
                                    <h3>Notifications</h3>
                                    <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                                </div>
                                <div className="notification-list">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div key={notif._id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                                                <div className="notification-icon">
                                                    {notif.type === 'news' ? <div className="dot news-dot"></div> : <div className="dot econtent-dot"></div>}
                                                </div>
                                                <div className="notification-content">
                                                    <p>{notif.message}</p>
                                                    <span className="notification-time">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {notif.link && (
                                                    <Link to={notif.link} className="notification-link" onClick={() => setShowNotifications(false)}>
                                                        View
                                                    </Link>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-notifications">No new notifications</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="navbar-divider"></div>

                    {user ? (
                        <div className="navbar-user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hi, {user.username}</span>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            <User size={18} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Login Flow Modals */}
            {loginStep === 'landing' && (
                <div className="city-modal-overlay">
                    <div className="login-modal-landing" onClick={e => e.stopPropagation()}>
                        <button onClick={closeAllModals} className="city-modal-close-absolute">
                            <X size={24} />
                        </button>
                        <div className="login-landing-content">
                            <h2>Welcome to Bharat Swaraj e-paper.</h2>
                            <p>Access to e-papers from 40 cities of Gujarat and Mumbai</p>
                            <div className="login-landing-image-placeholder">
                                <Newspaper size={64} color="#4b5563" />
                            </div>
                            <button className="login-action-btn" onClick={handleLoginToRead}>
                                Login to read
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* City Selection Modal */}
            {showCityModal && (
                <div className="city-modal-overlay">
                    <div className="city-modal" onClick={e => e.stopPropagation()}>
                        <div className="city-modal-header">
                            <h3>Select city</h3>
                            <div className="city-search-wrapper">
                                <Search size={16} className="city-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search the city"
                                    className="city-search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="city-grid-container">
                            <div className="city-grid">
                                {filteredCities.map(city => (
                                    <button
                                        key={city}
                                        className={`city-btn ${selectedCity === city ? 'selected' : ''}`}
                                        onClick={() => setSelectedCity(city)}
                                    >
                                        {city} <span className="city-plus">+</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="city-modal-footer">
                            <button
                                className="city-submit-btn"
                                onClick={handleCitySubmit}
                                disabled={!selectedCity}
                            >
                                Go ahead.
                            </button>
                        </div>

                        <button onClick={closeAllModals} className="city-modal-close-absolute">
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
