import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import NewsCard from '../components/NewsCard';
import { Search } from 'lucide-react';
import SEO from '../components/SEO';
import './Home.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchNews = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/news?search=${encodeURIComponent(query)}`);
            setResults(res.data.news);
        } catch (err) {
            console.error('Error searching news:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        if (query) {
            searchNews();
        }
    }, [query, searchNews]);

    return (
        <div className="home-container">
            <SEO title={`Search Results for "${query}"`} />

            {/* Header */}
            <div className="admin-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <div>
                    <h1 className="home-title" style={{ fontSize: '1.5rem', fontWeight: 700, gap: '0.5rem', marginBottom: 0 }}>
                        <Search className="home-icon" size={24} style={{ color: '#60a5fa' }} />
                        Search Results for "{query}"
                    </h1>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, color: '#60a5fa' }}>
                    {results.length} {results.length === 1 ? 'Result' : 'Results'}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Searching...
                </div>
            ) : results.length > 0 ? (
                <div className="home-news-grid">
                    {results.map(item => (
                        <NewsCard key={item._id} news={item} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No results found for "{query}"</p>
                    <p style={{ fontSize: '0.875rem' }}>Try searching with different keywords</p>
                    <Link to="/" style={{ marginTop: '1rem', display: 'inline-block', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                        ← Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
