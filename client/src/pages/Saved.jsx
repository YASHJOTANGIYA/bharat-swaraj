import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import axios from 'axios';
import API_URL from '../config/api';
import { Bookmark } from 'lucide-react';
import './Home.css';

const Saved = () => {
    const [savedNews, setSavedNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedNews();
    }, []);

    const fetchSavedNews = async () => {
        try {
            const savedIds = JSON.parse(localStorage.getItem('savedArticles') || '[]');

            if (savedIds.length === 0) {
                setLoading(false);
                return;
            }

            const res = await axios.get(`${API_URL}/api/news?ids=${savedIds.join(',')}`);
            setSavedNews(res.data.news);
        } catch (err) {
            console.error('Error fetching saved news:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            {/* Header */}
            <div className="home-header">
                <div>
                    <h1 className="home-title">
                        <Bookmark className="home-icon" size={24} style={{ color: '#60a5fa' }} />
                        Saved Articles
                    </h1>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, color: '#60a5fa' }}>
                    {savedNews.length} Saved
                </div>
            </div>

            {/* News Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading...
                </div>
            ) : savedNews.length > 0 ? (
                <div className="home-news-grid">
                    {savedNews.map(item => (
                        <NewsCard key={item._id} news={item} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Bookmark size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No saved articles yet</p>
                    <p style={{ fontSize: '0.875rem' }}>Click the bookmark icon on any article to save it</p>
                </div>
            )}
        </div>
    );
};

export default Saved;
