import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Play } from 'lucide-react';
import './Shorts.css';

const Shorts = () => {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/news?isShort=true`);
                setShorts(res.data.news);
            } catch (err) {
                console.error('Error fetching shorts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchShorts();
    }, []);

    if (loading) {
        return <div className="shorts-loading">Loading...</div>;
    }

    if (shorts.length === 0) {
        return <div className="shorts-empty">No Shorts found.</div>;
    }

    return (
        <div className="shorts-page-container">
            <SEO title="Shorts" description="Watch the latest Shorts from Bharat Swaraj" />

            <div className="shorts-page-header">
                <h1 className="shorts-page-title">Shorts</h1>
            </div>

            <div className="shorts-grid">
                {shorts.map((item) => (
                    <Link to={`/article/${item._id}`} key={item._id} className="shorts-grid-item">
                        <div className="shorts-grid-thumbnail-container">
                            <img
                                src={item.image || (item.youtubeVideoId ? `https://img.youtube.com/vi/${item.youtubeVideoId}/maxresdefault.jpg` : '')}
                                alt={item.title}
                                className="shorts-grid-thumbnail"
                            />
                            <div className="shorts-grid-play-overlay">
                                <Play fill="white" color="white" size={32} />
                            </div>
                        </div>
                        <h3 className="shorts-grid-title">{item.title}</h3>
                        <span className="shorts-grid-views">
                            {Math.floor(Math.random() * 1000) + 100} views
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Shorts;
