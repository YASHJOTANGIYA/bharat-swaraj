import React, { useState } from 'react';
import { Sparkles, Star, Moon, Sun, X, ArrowRight } from 'lucide-react';
import './Horoscope.css';

const ZODIAC_SIGNS = [
    { name: 'Aries', dates: 'Mar 21 - Apr 19', element: 'Fire' },
    { name: 'Taurus', dates: 'Apr 20 - May 20', element: 'Earth' },
    { name: 'Gemini', dates: 'May 21 - Jun 20', element: 'Air' },
    { name: 'Cancer', dates: 'Jun 21 - Jul 22', element: 'Water' },
    { name: 'Leo', dates: 'Jul 23 - Aug 22', element: 'Fire' },
    { name: 'Virgo', dates: 'Aug 23 - Sep 22', element: 'Earth' },
    { name: 'Libra', dates: 'Sep 23 - Oct 22', element: 'Air' },
    { name: 'Scorpio', dates: 'Oct 23 - Nov 21', element: 'Water' },
    { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', element: 'Fire' },
    { name: 'Capricorn', dates: 'Dec 22 - Jan 19', element: 'Earth' },
    { name: 'Aquarius', dates: 'Jan 20 - Feb 18', element: 'Air' },
    { name: 'Pisces', dates: 'Feb 19 - Mar 20', element: 'Water' }
];

const PREDICTIONS = [
    "Today brings new opportunities for growth. Keep an open mind and embrace change.",
    "Focus on your personal goals today. Your determination will lead to success.",
    "A surprise encounter may brighten your day. Stay social and connected.",
    "Trust your intuition today. It will guide you through complex decisions.",
    "Your creative energy is high. Use it to solve problems in innovative ways.",
    "Patience is key today. Good things come to those who wait.",
    "Financial matters look positive. It's a good day for planning your future.",
    "Reconnect with an old friend. Shared memories will bring joy.",
    "Take some time for self-care. A rested mind is a powerful mind.",
    "Teamwork is essential today. Collaborate to achieve the best results.",
    "Adventure calls! Try something new or explore a new place.",
    "Your hard work is about to pay off. Stay focused on the finish line."
];

const Horoscope = () => {
    const [selectedSign, setSelectedSign] = useState(null);

    const getPrediction = (signName) => {
        // Simple deterministic prediction based on date and sign length
        const today = new Date().getDate();
        const signIndex = ZODIAC_SIGNS.findIndex(s => s.name === signName);
        const predictionIndex = (today + signIndex) % PREDICTIONS.length;
        return PREDICTIONS[predictionIndex];
    };

    return (
        <div className="horoscope-widget">
            <div className="horoscope-header">
                <div className="horoscope-title">
                    <Sparkles className="horoscope-icon" size={20} />
                    <h3>Daily Horoscope</h3>
                </div>
                <span className="horoscope-date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </span>
            </div>

            <div className="zodiac-grid">
                {ZODIAC_SIGNS.map((sign) => (
                    <button
                        key={sign.name}
                        className={`zodiac-btn ${selectedSign?.name === sign.name ? 'active' : ''}`}
                        onClick={() => setSelectedSign(sign)}
                    >
                        <span className="zodiac-initial">{sign.name[0]}</span>
                        <span className="zodiac-name">{sign.name}</span>
                    </button>
                ))}
            </div>

            {selectedSign && (
                <div className="horoscope-modal-overlay" onClick={() => setSelectedSign(null)}>
                    <div className="horoscope-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-group">
                                <div className="modal-icon-wrapper">
                                    {selectedSign.name[0]}
                                </div>
                                <div>
                                    <h3>{selectedSign.name}</h3>
                                    <span className="modal-dates">{selectedSign.dates}</span>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setSelectedSign(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="prediction-card">
                                <Star className="prediction-icon" size={16} />
                                <p>{getPrediction(selectedSign.name)}</p>
                            </div>

                            <div className="daily-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Lucky Number</span>
                                    <span className="stat-value">
                                        {Math.floor(Math.random() * 9) + 1}
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Mood</span>
                                    <span className="stat-value">Optimistic</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Color</span>
                                    <span className="stat-value">Blue</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Horoscope;
