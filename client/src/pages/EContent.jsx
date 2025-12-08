import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Plus, X, Upload, Calendar, Share2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import './EContent.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

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
            const response = await fetch(`http://localhost:5000/api/econtent/${city}`);
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
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
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

            const uploadRes = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();
            const pdfUrl = uploadData.imageUrl; // The route returns { imageUrl: ... }

            // 2. Create EContent Record
            const eContentRes = await fetch('http://localhost:5000/api/econtent', {
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
            }
        } catch (error) {
            console.error('Error adding e-content:', error);
            alert('Failed to add e-content');
        } finally {
            setUploading(false);
        }
    };

    const handleOpenPdf = (url) => {
        window.open(url, '_blank');
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
                        eContents.map((item) => (
                            <div key={item._id} className="econtent-card">
                                <div className="econtent-thumbnail" onClick={() => handleOpenPdf(item.pdfUrl)}>
                                    <Document
                                        file={item.pdfUrl}
                                        loading={<div className="pdf-loading">Loading Preview...</div>}
                                        error={<div className="pdf-error">Preview Unavailable</div>}
                                        className="pdf-document"
                                    >
                                        <Page
                                            pageNumber={1}
                                            width={280}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            className="pdf-page"
                                        />
                                    </Document>
                                    <div className="pdf-icon-overlay">
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
                                        <button className="econtent-share-btn">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
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
