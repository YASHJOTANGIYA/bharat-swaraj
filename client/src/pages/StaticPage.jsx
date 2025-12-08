import React from 'react';

const StaticPage = ({ title, content }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">{title}</h1>
            <div className="prose prose-lg text-gray-700">
                {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <p>Content for {title} coming soon.</p>
                )}
            </div>
        </div>
    );
};

export default StaticPage;
