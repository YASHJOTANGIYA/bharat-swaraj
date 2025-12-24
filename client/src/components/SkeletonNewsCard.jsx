import React from 'react';
import './SkeletonNewsCard.css';

const SkeletonNewsCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-content">
                <div className="skeleton-body">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-title-short"></div>
                    <div className="skeleton-summary"></div>
                </div>
                <div className="skeleton-footer">
                    <div className="skeleton-category"></div>
                    <div className="skeleton-actions">
                        <div className="skeleton-action"></div>
                        <div className="skeleton-action"></div>
                        <div className="skeleton-action"></div>
                    </div>
                </div>
            </div>
            <div className="skeleton-image"></div>
        </div>
    );
};

export default SkeletonNewsCard;
