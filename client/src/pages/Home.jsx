import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import NewsCard from '../components/NewsCard';
import { Flame, TrendingUp, Youtube } from 'lucide-react';
import './Home.css';
import Sidebar from '../components/Sidebar';
import LiveTV from '../components/LiveTV';
import GoldRate from '../components/GoldRate';
import Weather from '../components/Weather';
import Horoscope from '../components/Horoscope';
import { usePageTitle } from '../hooks/usePageTitle';

import SEO from '../components/SEO';
import ShortsFeed from '../components/ShortsFeed';

const Home = () => {
    usePageTitle('Home');
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('stories'); // 'stories' or 'shorts'

    const fetchNews = async (pageNum = 1, isLoadMore = false) => {
        try {
            if (!isLoadMore) setLoading(true);
            const res = await axios.get(`${API_URL}/api/news?isShort=false&page=${pageNum}&limit=12`);

            if (isLoadMore) {
                setNewsItems(prev => [...prev, ...res.data.news]);
            } else {
                setNewsItems(res.data.news);
            }
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching news:', err);
            if (!isLoadMore) setNewsItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(1);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNews(nextPage, true);
    };

    return (
        <div className="home-container">
            <SEO title="Home" />
            {/* Hero Section Header */}
            <div className="home-header">
                <div className="home-tabs">
                    <button
                        className={`home-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stories')}
                    >
                        <Flame className="home-icon" size={24} />
                        Top Stories
                    </button>
                    <button
                        className={`home-tab-btn ${activeTab === 'shorts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shorts')}
                    >
                        <Youtube className="home-icon" size={24} />
                        Shorts
                    </button>
                </div>
                <Link to="/trending" className="home-trending-btn">
                    <TrendingUp size={18} />
                    Trending Now
                </Link>
            </div>

            <div className="home-content-wrapper">
                {/* Main Content Column */}
                <div className="home-main-column">
                    {activeTab === 'stories' ? (
                        <>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    Loading news...
                                </div>
                            ) : newsItems.length > 0 ? (
                                <>
                                    <div className="home-news-grid">
                                        {newsItems.map(item => (
                                            <NewsCard key={item.id || item._id} news={item} />
                                        ))}
                                    </div>
                                    {page < totalPages && (
                                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                                            <button
                                                onClick={handleLoadMore}
                                                style={{
                                                    padding: '0.75rem 2.5rem',
                                                    backgroundColor: '#2563eb',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '9999px',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                Load More Stories
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No news articles yet</p>
                                    <p style={{ fontSize: '0.875rem' }}>Go to Admin panel to add your first article!</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <ShortsFeed />
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

export default Home;
