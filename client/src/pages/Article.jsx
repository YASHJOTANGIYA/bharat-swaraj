import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { Calendar, User, Share2, Bookmark, ArrowLeft, Tag, X, Copy, Check } from 'lucide-react';
import Comments from '../components/Comments';
import SEO from '../components/SEO';
import './Article.css';

const Article = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        fetchArticle();
        checkIfSaved();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/news/${id}`);
            setArticle(res.data);

            // Fetch related news based on category
            if (res.data.category) {
                fetchRelatedNews(res.data.category, res.data._id);
            }
        } catch (err) {
            console.error('Error fetching article:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedNews = async (category, currentId) => {
        try {
            const res = await axios.get(`${API_URL}/api/news`, {
                params: {
                    category: category,
                    limit: 3,
                    exclude: currentId
                }
            });
            setRelatedNews(res.data);
        } catch (err) {
            console.error('Error fetching related news:', err);
        }
    };

    const checkIfSaved = () => {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        setIsSaved(savedArticles.includes(id));
    };

    const handleShare = () => {
        setShowShareMenu(true);
    };

    const copyToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShowShareMenu(false);
            }, 1500);
        }).catch(() => {
            alert('Failed to copy link');
        });
    };

    const shareToSocial = (platform) => {
        const url = window.location.href;
        const text = article.title;

        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const handleSave = () => {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');

        if (isSaved) {
            const filtered = savedArticles.filter(articleId => articleId !== id);
            localStorage.setItem('savedArticles', JSON.stringify(filtered));
            setIsSaved(false);
        } else {
            savedArticles.push(id);
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
            setIsSaved(true);
        }
    };

    if (loading) {
        return (
            <div className="article-loading">
                <div className="loading-spinner"></div>
                <p>Loading article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="article-not-found">
                <h2>Article Not Found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    Go Back Home
                </button>
            </div>
        );
    }

    return (
        <>
            {article && (
                <SEO
                    title={article.title}
                    description={article.summary || article.content.substring(0, 150)}
                    image={article.image || (article.youtubeVideoId ? `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg` : null)}
                    url={`/article/${article._id}`}
                />
            )}
            <div className="article-container">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="article-back-btn">
                    <ArrowLeft size={20} />
                    Back
                </button>

                {/* Article Header */}
                <div className="article-header">
                    <div className="article-category-badge">
                        <Tag size={16} />
                        {article.category}
                    </div>
                    <h1 className="article-title">{article.title}</h1>
                    <p className="article-summary">{article.summary}</p>

                    {/* Meta Info */}
                    <div className="article-meta">
                        <div className="article-meta-item">
                            <User size={16} />
                            <span>{article.author || 'Admin'}</span>
                        </div>
                        <div className="article-meta-item">
                            <Calendar size={16} />
                            <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="article-actions">
                        <button className="article-action-btn" onClick={handleShare}>
                            <Share2 size={18} />
                            Share
                        </button>
                        <button
                            className={`article-action-btn ${isSaved ? 'saved' : ''}`}
                            onClick={handleSave}
                        >
                            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Featured Image - Only show if not a YouTube video */}
                {article.image && !article.youtubeVideoId && (
                    <div className="article-image-container">
                        <img src={article.image} alt={article.title} className="article-image" />
                    </div>
                )}

                {/* Featured Video */}
                {article.video && (
                    <div className="article-video-container" style={{ marginTop: '2rem', borderRadius: '1rem', overflow: 'hidden' }}>
                        <video
                            src={article.video}
                            controls
                            style={{ width: '100%', display: 'block' }}
                            poster={article.image}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* YouTube Video Embed */}
                {article.youtubeVideoId && (
                    <div className="article-youtube-container" style={{ marginTop: '2rem', borderRadius: '1rem', overflow: 'hidden', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            src={`https://www.youtube.com/embed/${article.youtubeVideoId}`}
                            title={article.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                {/* Article Content */}
                <div className="article-content">
                    <div className="article-text">
                        {article.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related News Section */}
            {relatedNews.length > 0 && (
                <div className="related-news-container" style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        Related News
                    </h3>
                    <div className="related-news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {relatedNews.map(item => (
                            <div key={item._id} className="related-news-card" onClick={() => { navigate(`/article/${item._id}`); window.scrollTo(0, 0); }} style={{ cursor: 'pointer', background: 'var(--bg-secondary)', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}>
                                <div style={{ height: '160px', overflow: 'hidden' }}>
                                    <img
                                        src={item.image || (item.youtubeVideoId ? `https://img.youtube.com/vi/${item.youtubeVideoId}/mqdefault.jpg` : '/placeholder-news.jpg')}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                                        {item.category}
                                    </span>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.title}
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <Calendar size={12} />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <Comments newsId={id} />

            {/* Share Menu Modal */}
            {showShareMenu && (
                <div className="share-modal-overlay" onClick={() => setShowShareMenu(false)}>
                    <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="share-modal-header">
                            <h3>Share Article</h3>
                            <button onClick={() => setShowShareMenu(false)} className="share-modal-close">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="share-options">
                            <button onClick={() => shareToSocial('twitter')} className="share-option twitter">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Twitter
                            </button>

                            <button onClick={() => shareToSocial('facebook')} className="share-option facebook">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>

                            <button onClick={() => shareToSocial('whatsapp')} className="share-option whatsapp">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                WhatsApp
                            </button>

                            <button onClick={() => shareToSocial('linkedin')} className="share-option linkedin">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </button>

                            <button onClick={copyToClipboard} className="share-option copy">
                                {copied ? <Check size={24} /> : <Copy size={24} />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Article;
