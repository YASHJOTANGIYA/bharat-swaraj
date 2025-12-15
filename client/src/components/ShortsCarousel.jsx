import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Play, Youtube } from 'lucide-react';
import './ShortsCarousel.css';
import { Link } from 'react-router-dom';

const ShortsCarousel = () => {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/news?isShort=true&limit=10`);
                setShorts(res.data.news);
            } catch (err) {
                console.error('Error fetching shorts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    if (loading || shorts.length === 0) return null;

    return (
        <div className="shorts-section">
            <div className="shorts-header">
                <div className="shorts-title-wrapper">
                    <Youtube className="shorts-icon" size={24} color="#FF0000" />
                    <h2 className="shorts-title">Shorts</h2>
                </div>
                <Link to="/shorts" className="view-all-shorts">View All</Link>
            </div>

            <div className="shorts-carousel">
                {shorts.map(item => (
                    <Link to={`/article/${item._id}`} key={item._id} className="short-card">
                        <div className="short-thumbnail-container">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="short-thumbnail"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x533?text=No+Image';
                                }}
                            />
                            <div className="short-play-overlay">
                                <Play size={24} fill="white" stroke="white" />
                            </div>
                        </div>
                        <h3 className="short-title">{item.title}</h3>
                        <div className="short-views">{item.views ? `${item.views.toLocaleString()} views` : 'New'}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ShortsCarousel;
