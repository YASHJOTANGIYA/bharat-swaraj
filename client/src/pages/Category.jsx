import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import NewsCard from '../components/NewsCard';
import Weather from '../components/Weather';
import Horoscope from '../components/Horoscope';
import LiveTV from '../components/LiveTV';
import GoldRate from '../components/GoldRate';
import { Tag } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import '../pages/Home.css';

const Category = () => {
    const { category } = useParams();
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    usePageTitle(`${categoryName} News`);

    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryNews();
    }, [category]);

    const fetchCategoryNews = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/news`);
            console.log('All news:', res.data);
            console.log('Filtering for category:', category);

            // Filter by category (case-insensitive)
            const filtered = res.data.filter(news => {
                const newsCategory = (news.category || '').toLowerCase().trim();
                const filterCategory = category.toLowerCase().trim();
                console.log(`Comparing: "${newsCategory}" === "${filterCategory}"`, newsCategory === filterCategory);
                return newsCategory === filterCategory;
            });

            console.log('Filtered results:', filtered);
            setNewsItems(filtered);
        } catch (err) {
            console.error('Error fetching news:', err);
            setNewsItems([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            {/* Header */}
            <div className="admin-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <div>
                    <h1 className="home-title" style={{ fontSize: '1.5rem', fontWeight: 700, gap: '0.5rem', marginBottom: 0 }}>
                        <Tag className="home-icon" size={24} style={{ color: '#60a5fa' }} />
                        {categoryName} News
                    </h1>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, color: '#60a5fa' }}>
                    {newsItems.length} {newsItems.length === 1 ? 'Article' : 'Articles'}
                </div>
            </div>

            <div className="home-content-wrapper">
                {/* Main News Column */}
                <div className="home-main-column">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                            Loading...
                        </div>
                    ) : newsItems.length > 0 ? (
                        <div className="home-news-grid">
                            {newsItems.map(item => (
                                <NewsCard key={item._id} news={item} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No articles found in this category</p>
                            <p style={{ fontSize: '0.875rem' }}>Check back later for updates</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="home-sidebar">
                    <Weather />
                    <Horoscope />
                    <LiveTV />
                    <GoldRate />
                </div>
            </div>
        </div>
    );
};

export default Category;
