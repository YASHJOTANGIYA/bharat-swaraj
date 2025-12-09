import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import './BreakingNewsTicker.css';

const BreakingNewsTicker = () => {
    const [breakingNews, setBreakingNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBreakingNews();
        // Refresh breaking news every 2 minutes
        const interval = setInterval(fetchBreakingNews, 120000);
        return () => clearInterval(interval);
    }, []);

    const fetchBreakingNews = async () => {
        try {
            const response = await fetch(`${API_URL}/api/news?limit=5&sort=-createdAt`);
            if (response.ok) {
                const data = await response.json();
                // Get the 5 most recent news items
                setBreakingNews(data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching breaking news:', error);
        }
    };

    const handleNewsClick = (newsId) => {
        navigate(`/article/${newsId}`);
    };

    if (breakingNews.length === 0) return null;

    return (
        <div className="breaking-news-ticker">
            <div className="ticker-label">
                <Zap size={16} className="ticker-icon" />
                <span className="ticker-text">BREAKING</span>
            </div>

            <div className="ticker-content">
                <div className="ticker-scroll">
                    {breakingNews.map((news, index) => (
                        <span
                            key={news._id || index}
                            className="ticker-item"
                            onClick={() => handleNewsClick(news._id)}
                        >
                            {news.title}
                            <span className="ticker-separator">•</span>
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {breakingNews.map((news, index) => (
                        <span
                            key={`duplicate-${news._id || index}`}
                            className="ticker-item"
                            onClick={() => handleNewsClick(news._id)}
                        >
                            {news.title}
                            <span className="ticker-separator">•</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreakingNewsTicker;
