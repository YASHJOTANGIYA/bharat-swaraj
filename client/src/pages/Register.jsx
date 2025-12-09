import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import '../pages/Login.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            await axios.post(`${API_URL}/api/auth/register`, formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <h2 className="login-title">Create Account</h2>
                    <p className="login-subtitle">Join Bharat Swaraj to stay updated with latest news</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label className="login-label">Username</label>
                        <div className="login-input-wrapper">
                            <UserIcon size={18} className="login-input-icon" />
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                        <p className="password-hint">Minimum 6 characters</p>
                    </div>

                    <div className="register-features">
                        <div className="feature-item">
                            <CheckCircle size={16} />
                            <span>Access to all news categories</span>
                        </div>
                        <div className="feature-item">
                            <CheckCircle size={16} />
                            <span>Save and bookmark articles</span>
                        </div>
                        <div className="feature-item">
                            <CheckCircle size={16} />
                            <span>Personalized news feed</span>
                        </div>
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p>Already have an account? <Link to="/login" className="login-register-link">Sign in</Link></p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="login-decoration login-decoration-1"></div>
            <div className="login-decoration login-decoration-2"></div>
        </div>
    );
};

export default Register;
