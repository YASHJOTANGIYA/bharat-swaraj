import React, { useState } from 'react';
import { Youtube, PlayCircle, Play, ExternalLink } from 'lucide-react';
import './LiveTV.css';

const LiveTV = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="live-tv-card">
            {/* Background Glow */}
            <div className="live-tv-glow"></div>

            {/* Header */}
            <div className="live-tv-header">
                <div className="live-tv-title-group">
                    <div className="tv-icon-box">
                        <Youtube size={18} className="tv-icon" />
                    </div>
                    <div>
                        <h2 className="tv-title">Bharat Swaraj Weekly</h2>
                        <p className="tv-subtitle">Latest Videos</p>
                    </div>
                </div>
                <a
                    href="https://www.youtube.com/@bharatswarajweekly2359"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="on-air-badge"
                >
                    <ExternalLink size={10} />
                    Visit Channel
                </a>
            </div>

            {/* Video Player (Lite Facade Pattern - Loads iframe only on click) */}
            <div className="video-container">
                {isPlaying ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed?listType=playlist&list=UUlhHd2VV7i-aMEXV63La1Lw&autoplay=1"
                        title="Bharat Swaraj Weekly Videos"
                        frameBorder="0"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                ) : (
                    <div
                        className="tv-facade-preview"
                        onClick={() => setIsPlaying(true)}
                        title="Click to play latest videos"
                    >
                        <div className="tv-facade-overlay"></div>
                        <button className="tv-facade-play-btn" aria-label="Play video">
                            <Play size={28} fill="white" color="white" />
                        </button>
                        <span className="tv-facade-hint">Click to watch latest videos</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="live-tv-footer">
                <p className="streaming-text">
                    <PlayCircle size={10} />
                    Playing latest uploads from Bharat Swaraj Weekly
                </p>
            </div>
        </div>
    );
};

export default LiveTV;
