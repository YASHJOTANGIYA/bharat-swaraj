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
import SkeletonNewsCard from '../components/SkeletonNewsCard';

const Home = () => {
    usePageTitle('Home');
    const [newsItems, setNewsItems] = useState(() => {
        const saved = localStorage.getItem('homeNews');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(() => {
        return !localStorage.getItem('homeNews');
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('stories'); // 'stories', 'shorts', 'foryou'
    const [userTopics, setUserTopics] = useState(() => {
        const saved = localStorage.getItem('userTopics');
        return saved ? JSON.parse(saved) : [];
    });
    
    const availableCategories = ['Politics', 'Technology', 'Sports', 'Entertainment', 'Business', 'Health'];

    const toggleTopic = (topic) => {
        const newTopics = userTopics.includes(topic) 
            ? userTopics.filter(t => t !== topic)
            : [...userTopics, topic];
        setUserTopics(newTopics);
        localStorage.setItem('userTopics', JSON.stringify(newTopics));
    };

    const fetchNews = async (pageNum = 1, isLoadMore = false) => {
        try {
            // Only show skeleton loader if we don't have any cached news
            if (!isLoadMore && newsItems.length === 0) setLoading(true);
            const res = await axios.get(`${API_URL}/api/news?isShort=false&page=${pageNum}&limit=12`);

            if (isLoadMore) {
                setNewsItems(prev => {
                    const existingIds = new Set(prev.map(item => item._id || item.id));
                    const newItems = res.data.news.filter(item => !existingIds.has(item._id || item.id));
                    return [...prev, ...newItems];
                });
            } else {
                setNewsItems(res.data.news);
                if (pageNum === 1) {
                    localStorage.setItem('homeNews', JSON.stringify(res.data.news));
                }
            }
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching news:', err);
            if (!isLoadMore && newsItems.length === 0) setNewsItems([]);
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

    const getPersonalizedNews = () => {
        if (userTopics.length === 0) return [];
        const lowerTopics = userTopics.map(t => t.toLowerCase());
        return newsItems.filter(item => item.category && lowerTopics.includes(item.category.toLowerCase()));
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
                        className={`home-tab-btn ${activeTab === 'foryou' ? 'active' : ''}`}
                        onClick={() => setActiveTab('foryou')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="home-icon" style={{width: 24, height: 24}}>
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        For You
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
                                <div className="home-news-grid">
                                    {[...Array(6)].map((_, index) => (
                                        <SkeletonNewsCard key={index} />
                                    ))}
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
                    ) : activeTab === 'foryou' ? (
                        <div className="foryou-container" style={{ padding: '1rem 0' }}>
                            <div className="topic-selector" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>✨ Select your favorite topics</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {availableCategories.map(cat => (
                                        <button 
                                            key={cat} 
                                            onClick={() => toggleTopic(cat)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '2rem',
                                                border: userTopics.includes(cat) ? 'none' : '1px solid var(--border-color)',
                                                background: userTopics.includes(cat) ? 'var(--accent-color)' : 'transparent',
                                                color: userTopics.includes(cat) ? 'white' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat} {userTopics.includes(cat) && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {userTopics.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                                    <svg style={{ width: '64px', height: '64px', margin: '0 auto 1rem auto', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    <h3>Select topics above to see your personalized feed</h3>
                                </div>
                            ) : getPersonalizedNews().length > 0 ? (
                                <div className="home-news-grid">
                                    {getPersonalizedNews().map(item => (
                                        <NewsCard key={item.id || item._id} news={item} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                                    <p>No news found for your selected topics right now.</p>
                                    <p>Try selecting more topics!</p>
                                </div>
                            )}
                        </div>
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
