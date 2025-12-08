import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, ArrowRight, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [subscribed, setSubscribed] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/general/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSubscribed(true);
                setEmail('');
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.png" alt="Bharat Swaraj" className="footer-logo-img" />
                        </Link>
                        <p className="footer-description">
                            Empowering the nation with truth, integrity, and unbiased journalism.
                            Your trusted source for news that matters to India and the world.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="#" className="social-link" aria-label="YouTube"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Explore</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/trending">Trending News</Link></li>
                            <li><Link to="/category/india">India</Link></li>
                            <li><Link to="/category/world">World</Link></li>
                            <li><Link to="/category/technology">Technology</Link></li>
                            <li><Link to="/category/entertainment">Entertainment</Link></li>
                            <li><Link to="/category/sports">Sports</Link></li>
                        </ul>
                    </div>

                    {/* Company & Legal */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Company</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><span className="footer-disabled-link" style={{ cursor: 'not-allowed', opacity: 0.5 }}>Careers</span></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-newsletter">
                        <h4 className="footer-heading">Stay Updated</h4>
                        <p className="newsletter-text">Subscribe to our newsletter for the latest headlines delivered to your inbox.</p>

                        {subscribed ? (
                            <div className="subscription-success">
                                <p>Thank you for subscribing! We will notify you when new news is added to our website.</p>
                            </div>
                        ) : (
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <div className="input-group">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="newsletter-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="newsletter-btn" disabled={loading}>
                                    {loading ? 'Subscribing...' : 'Subscribe'} <Send size={16} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        &copy; {new Date().getFullYear()} Bharat Swaraj. All rights reserved.
                    </div>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy</Link>
                        <span className="separator">•</span>
                        <Link to="/terms">Terms</Link>
                        <span className="separator">•</span>
                        <Link to="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
