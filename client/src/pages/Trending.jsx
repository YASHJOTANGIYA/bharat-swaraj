import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import axios from 'axios';
import API_URL from '../config/api';
import { TrendingUp } from 'lucide-react';
import './Home.css';

const Trending = () => {
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/news?sort=-views&limit=12`);
            setNewsItems(res.data.news);
        } catch (err) {
            console.error('Error fetching news:', err);
        }
    };

    return (
        <div className="home-container">
            {/* Header */}
            <div className="home-header">
                <div>
                    <h1 className="home-title">
                        <TrendingUp className="home-icon" size={24} style={{ color: '#f97316' }} />
                        Trending Now
                    </h1>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, color: '#fb923c' }}>
                    {newsItems.length} Trending
                </div>
            </div>

            {/* News Grid */}
            <div className="home-news-grid">
                {newsItems.map(item => (
                    <NewsCard key={item._id} news={item} />
                ))}
            </div>
        </div>
    );
};

export default Trending;
