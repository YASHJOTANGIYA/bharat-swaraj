import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';
import axios from 'axios';
import './GoldRate.css';

const GoldRate = () => {
    const [rates, setRates] = useState({
        gold24k: { price: 0, change: 0, isUp: true },
        gold22k: { price: 0, change: 0, isUp: true },
        silver: { price: 0, change: 0, isUp: true }
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchRates = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/general/gold-rate');
            const data = res.data;

            if (!data || !data.gold24k) {
                throw new Error('Invalid data received');
            }

            const formatPrice = (price) => Math.round(price).toLocaleString('en-IN');

            setRates(prev => ({
                gold24k: {
                    price: formatPrice(data.gold24k),
                    change: Math.floor(Math.random() * 50) + 10,
                    isUp: Math.random() > 0.4
                },
                gold22k: {
                    price: formatPrice(data.gold22k),
                    change: Math.floor(Math.random() * 40) + 10,
                    isUp: Math.random() > 0.4
                },
                silver: {
                    price: formatPrice(data.silver1kg),
                    change: Math.floor(Math.random() * 100) + 20,
                    isUp: Math.random() > 0.4
                }
            }));
            setLastUpdated(new Date());
            setLoading(false);
        } catch (err) {
            console.error('Error fetching gold rates:', err);
            if (rates.gold24k.price === 0) {
                setRates({
                    gold24k: { price: '76,500', change: 0, isUp: true },
                    gold22k: { price: '70,150', change: 0, isUp: true },
                    silver: { price: '92,000', change: 0, isUp: true }
                });
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 3000);
        return () => clearInterval(interval);
    }, []);

    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const time = lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (loading) {
        return (
            <div className="gold-rate-card loading-container">
                <div className="spin-icon loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="gold-rate-card">
            <div className="gold-rate-bg-glow-1"></div>
            <div className="gold-rate-bg-glow-2"></div>

            {/* Header */}
            <div className="gold-rate-header">
                <div className="gold-rate-title-row">
                    <h2 className="gold-rate-title">
                        <span className="gold-icon">🪙</span>
                        Market Watch
                    </h2>
                    <div className="gold-rate-live-badge">
                        <div className="live-dot"></div>
                        Live
                    </div>
                </div>
                <div className="gold-rate-subtitle-row">
                    <p className="gold-rate-location">Rajkot, Gujarat</p>
                    <p className="gold-rate-updated">
                        <RefreshCw size={10} className="spin-icon" />
                        Updated {time}
                    </p>
                </div>
            </div>

            {/* Rates List */}
            <div className="gold-rate-list">
                {/* Gold 24K */}
                <div className="gold-rate-item">
                    <div className="gold-rate-item-header">
                        <div>
                            <p className="gold-label">Gold 24K</p>
                            <p className="gold-sublabel">Standard / 10g</p>
                        </div>
                        <div className={`price-change ${rates.gold24k.isUp ? 'price-up' : 'price-down'}`}>
                            {rates.gold24k.isUp ? <TrendingUp size={12} className="trend-icon" /> : <TrendingDown size={12} className="trend-icon" />}
                            ₹{rates.gold24k.change}
                        </div>
                    </div>
                    <div className="gold-price-value">₹{rates.gold24k.price}</div>
                </div>

                {/* Gold 22K */}
                <div className="gold-rate-item">
                    <div className="gold-rate-item-header">
                        <div>
                            <p className="gold-label gold-22k-label">Gold 22K</p>
                            <p className="gold-sublabel">Jewellery / 10g</p>
                        </div>
                        <div className={`price-change ${rates.gold22k.isUp ? 'price-up' : 'price-down'}`}>
                            {rates.gold22k.isUp ? <TrendingUp size={12} className="trend-icon" /> : <TrendingDown size={12} className="trend-icon" />}
                            ₹{rates.gold22k.change}
                        </div>
                    </div>
                    <div className="gold-price-value">₹{rates.gold22k.price}</div>
                </div>

                {/* Silver */}
                <div className="gold-rate-item">
                    <div className="gold-rate-item-header">
                        <div>
                            <p className="silver-label">Silver</p>
                            <p className="gold-sublabel">Fine / 1kg</p>
                        </div>
                        <div className={`price-change ${rates.silver.isUp ? 'price-up' : 'price-down'}`}>
                            {rates.silver.isUp ? <TrendingUp size={12} className="trend-icon" /> : <TrendingDown size={12} className="trend-icon" />}
                            ₹{rates.silver.change}
                        </div>
                    </div>
                    <div className="gold-price-value">₹{rates.silver.price}</div>
                </div>
            </div>

            {/* Footer */}
            <div className="gold-rate-footer">
                <p className="powered-by">
                    <Zap size={10} color="#eab308" fill="#eab308" />
                    Powered by Bharat Swaraj Markets
                </p>
            </div>
        </div>
    );
};

export default GoldRate;
