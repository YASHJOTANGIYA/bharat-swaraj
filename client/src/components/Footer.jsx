import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight, Send, MessageCircle } from 'lucide-react';
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
                            <a href="https://www.facebook.com/bharat.swaraj.1" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
                            <a href="https://x.com/BharatSwaraj_94" className="social-link" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/bharatswarajweekly" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                            <a href="https://chat.whatsapp.com/LSqhN8gZPvxBK8rb1t0Hdk" className="social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/results?search_query=bharat+swarajya+weekly" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
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
