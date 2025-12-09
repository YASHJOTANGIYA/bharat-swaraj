import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Dispatch a custom event to notify other components about the login
            window.dispatchEvent(new Event('storage'));

            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get('redirect');

            if (redirect === 'econtent') {
                navigate('/?action=econtent');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to access your Bharat Swaraj account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="register-error" style={{ marginBottom: '1rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label className="login-label">Email Address</label>
                        <div className="login-input-wrapper">
                            <Mail size={18} className="login-input-icon" />
                            <input
                                type="email"
                                className="login-input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrapper">
                            <Lock size={18} className="login-input-icon" />
                            <input
                                type="password"
                                className="login-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="login-checkbox">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="login-forgot">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                        <ArrowRight size={18} />
                    </button>

                    {/* Divider */}
                    <div className="login-divider">
                        <span>OR</span>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        className="google-signin-btn"
                        onClick={() => window.location.href = `${API_URL}/api/auth/google`}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4" />
                            <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853" />
                            <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05" />
                            <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register" className="login-register-link">Create one</Link></p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="login-decoration login-decoration-1"></div>
            <div className="login-decoration login-decoration-2"></div>
        </div>
    );
};

export default Login;
