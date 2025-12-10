import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Link } from 'react-router-dom';
import { Play, Youtube } from 'lucide-react';
import SEO from '../components/SEO';
import './Shorts.css';

const Shorts = () => {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/news?isShort=true`);
                setShorts(res.data);
            } catch (err) {
                console.error('Error fetching shorts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    return (
        <div className="shorts-page-container">
            <SEO title="YouTube Shorts" description="Watch the latest YouTube Shorts from Bharat Swaraj" />

            <div className="shorts-page-header">
                <Youtube className="shorts-page-icon" size={32} color="#FF0000" />
                <h1 className="shorts-page-title">YouTube Shorts</h1>
            </div>

            {loading ? (
                <div className="shorts-loading">Loading Shorts...</div>
            ) : shorts.length > 0 ? (
                <div className="shorts-grid">
                    {shorts.map(item => (
                        <Link to={`/article/${item._id}`} key={item._id} className="shorts-grid-item">
                            <div className="shorts-grid-thumbnail-container">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="shorts-grid-thumbnail"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x533?text=No+Image';
                                    }}
                                />
                                <div className="shorts-grid-play-overlay">
                                    <Play size={32} fill="white" stroke="white" />
                                </div>
                            </div>
                            <h3 className="shorts-grid-title">{item.title}</h3>
                            <div className="shorts-grid-views">{item.views ? `${item.views.toLocaleString()} views` : 'New'}</div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="shorts-empty">No Shorts found.</div>
            )}
        </div>
    );
};

export default Shorts;
