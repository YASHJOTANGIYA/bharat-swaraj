import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Plus, X, Upload, Calendar, Share2, Trash2 } from 'lucide-react';
import API_URL from '../config/api';
import './EContent.css';
import './econtent-delete.css';

const EContent = () => {
    const { city } = useParams();
    const [eContents, setEContents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Form State
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchEContents();
    }, [city]);

    const fetchEContents = async () => {
        try {
            const response = await fetch(`${API_URL}/api/econtent/${city}`);
            if (response.ok) {
                const data = await response.json();
                setEContents(data);
            }
        } catch (error) {
            console.error('Error fetching e-content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File is too large. Maximum size is 10MB for the free tier.');
                e.target.value = ''; // Reset input
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        try {
            // 1. Upload PDF
            const formData = new FormData();
            formData.append('image', file); // Using 'image' key as per upload route config

            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.message || errorData.error || 'Upload failed');
            }
            const uploadData = await uploadRes.json();
            const pdfUrl = uploadData.imageUrl; // The route returns { imageUrl: ... }

            // 2. Create EContent Record
            const eContentRes = await fetch(`${API_URL}/api/econtent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    city,
                    title,
                    pdfUrl
                })
            });

            if (eContentRes.ok) {
                setShowAddModal(false);
                setTitle('');
                setFile(null);
                fetchEContents();
            } else {
                const errorData = await eContentRes.json();
                throw new Error(errorData.message || 'Failed to create e-content record');
            }
        } catch (error) {
            console.error('Error adding e-content:', error);
            alert(`Failed to add e-content: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const getFullPdfUrl = (url) => {
        if (!url) return '';
        // Fix legacy localhost URLs
        if (url.includes('localhost:5000')) {
            return url.replace('http://localhost:5000', API_URL);
        }
        // Handle relative paths
        if (!url.startsWith('http')) {
            return `${API_URL}${url}`;
        }
        return url;
    };

    const getThumbnailUrl = (pdfUrl) => {
        if (!pdfUrl) return '';
        // If it's a Cloudinary URL, we can generate a thumbnail
        if (pdfUrl.includes('cloudinary.com')) {
            // Insert transformation before 'v<version>' or before the filename if no version
            // Transformation: pg_1 (page 1), f_jpg (format jpg)
            const parts = pdfUrl.split('/upload/');
            if (parts.length === 2) {
                return `${parts[0]}/upload/pg_1,f_jpg/${parts[1]}`;
            }
        }
        // Fallback for non-Cloudinary URLs (show generic PDF icon)
        return null;
    };

    const handleOpenPdf = (url) => {
        const fullUrl = getFullPdfUrl(url);
        window.open(fullUrl, '_blank');
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/econtent/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('E-Content deleted successfully');
                fetchEContents(); // Refresh the list
            } else {
                alert('Failed to delete e-content');
            }
        } catch (error) {
            console.error('Error deleting e-content:', error);
            alert('Failed to delete e-content');
        }
    };

    return (
        <div className="econtent-page">
            <div className="econtent-header">
                <div>
                    <h1 className="econtent-city-title">{city.charAt(0).toUpperCase() + city.slice(1)} E-Papers</h1>
                    <p className="econtent-subtitle">Read the latest editions from {city}</p>
                </div>
                {user?.role === 'admin' && (
                    <button className="add-econtent-btn" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} />
                        Add E-Content
                    </button>
                )}
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="econtent-grid">
                    {eContents.length > 0 ? (
                        eContents.map((item) => {
                            const thumbnailUrl = getThumbnailUrl(item.pdfUrl);
                            return (
                                <div key={item._id} className="econtent-card">
                                    <div className="econtent-thumbnail" onClick={() => handleOpenPdf(item.pdfUrl)}>
                                        {thumbnailUrl ? (
                                            <img
                                                src={thumbnailUrl}
                                                alt={item.title}
                                                className="pdf-thumbnail-img"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'; // Hide if thumbnail fails
                                                    e.target.nextSibling.style.display = 'flex'; // Show fallback
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback / Overlay */}
                                        <div className={`pdf-icon-overlay ${thumbnailUrl ? 'has-thumbnail' : ''}`}>
                                            <FileText size={48} />
                                        </div>

                                        <div className="econtent-preview-placeholder">
                                            <span>Click to Read</span>
                                        </div>
                                    </div>

                                    <div className="econtent-info">
                                        <h3 className="econtent-title">{item.title}</h3>
                                        <div className="econtent-meta">
                                            <div className="econtent-date">
                                                <Calendar size={14} />
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="econtent-share-btn">
                                                    <Share2 size={16} />
                                                </button>
                                                {user?.role === 'admin' && (
                                                    <button
                                                        className="econtent-delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(item._id, item.title);
                                                        }}
                                                        title="Delete E-Content"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-content">
                            <p>No e-papers available for {city} yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add E-Content Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New E-Content</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="add-econtent-form">
                            <div className="form-group">
                                <label>Title / Edition Name</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Morning Edition"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload PDF</label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        id="pdf-upload"
                                        required
                                    />
                                    <label htmlFor="pdf-upload" className="file-upload-label">
                                        <Upload size={20} />
                                        {file ? file.name : "Choose PDF file"}
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="submit-btn" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Add E-Content'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EContent;
