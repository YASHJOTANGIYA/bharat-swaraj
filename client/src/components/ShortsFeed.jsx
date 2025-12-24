import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './ShortsFeed.css';

const ShortsFeed = () => {
    const [shorts, setShorts] = useState(() => {
        const saved = localStorage.getItem('homeShorts');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(() => {
        return !localStorage.getItem('homeShorts');
    });
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/news?isShort=true`);
                setShorts(res.data.news);
                localStorage.setItem('homeShorts', JSON.stringify(res.data.news));
            } catch (err) {
                console.error('Error fetching shorts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    const handleScroll = () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const itemHeight = container.clientHeight;

        const index = Math.round(scrollPosition / itemHeight);
        if (index !== currentVideoIndex) {
            setCurrentVideoIndex(index);
        }
    };

    if (loading) return (
        <div className="shorts-feed-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
            <div style={{ width: '100%', maxWidth: '500px', aspectRatio: '9/16', background: '#1a1a1a', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
        </div>
    );
    if (shorts.length === 0) return <div className="shorts-feed-empty">No Shorts available</div>;

    return (
        <div className="shorts-feed-container" ref={containerRef} onScroll={handleScroll}>
            {shorts.map((item, index) => (
                <div key={item._id} className="shorts-feed-item">
                    <div className="shorts-player-wrapper">
                        {/* We use an iframe for YouTube embeds. 
                            Note: Autoplay on scroll with YouTube iframe API is complex due to browser policies.
                            We will load the iframe. Users might need to click to play depending on browser.
                        */}
                        <iframe
                            src={`https://www.youtube.com/embed/${item.youtubeVideoId}?enablejsapi=1&rel=0&modestbranding=1&loop=1&controls=1`}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="shorts-iframe"
                        ></iframe>
                    </div>
                    <div className="shorts-info-overlay">
                        <h3 className="shorts-overlay-title">{item.title}</h3>
                        <p className="shorts-overlay-views">{item.views ? `${item.views.toLocaleString()} views` : ''}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShortsFeed;
