import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, X, Calendar, Tag, Upload, Image as ImageIcon } from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const [newsList, setNewsList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        category: 'General',
        image: '',
        video: ''
    });
    const [uploading, setUploading] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');

    const [commentsList, setCommentsList] = useState([]);
    const [subscribersList, setSubscribersList] = useState([]);

    useEffect(() => {
        fetchNews();
        fetchComments();
        fetchSubscribers();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/news');
            setNewsList(res.data);
        } catch (err) {
            console.error('Error fetching news:', err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/comments');
            setCommentsList(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    const fetchSubscribers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/general/subscribers');
            setSubscribersList(res.data);
        } catch (err) {
            console.error('Error fetching subscribers:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await axios.delete(`http://localhost:5000/api/news/${id}`);
                fetchNews();
            } catch (err) {
                console.error('Error deleting news:', err);
            }
        }
    };

    const handleDeleteComment = async (id) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await axios.delete(`http://localhost:5000/api/comments/${id}`);
                fetchComments();
            } catch (err) {
                console.error('Error deleting comment:', err);
            }
        }
    };

    const handleDeleteSubscriber = async (id) => {
        if (window.confirm('Are you sure you want to remove this subscriber?')) {
            try {
                await axios.delete(`http://localhost:5000/api/general/subscribers/${id}`);
                fetchSubscribers();
            } catch (err) {
                console.error('Error deleting subscriber:', err);
            }
        }
    };

    // Helper function to generate thumbnail from video
    const generateVideoThumbnail = (videoFile) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;

            video.onloadedmetadata = () => {
                video.currentTime = 1; // Get frame at 1 second
            };

            video.onseeked = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to generate thumbnail'));
                    }
                }, 'image/jpeg', 0.9);

                URL.revokeObjectURL(video.src);
            };

            video.onerror = () => {
                reject(new Error('Failed to load video'));
            };

            video.src = URL.createObjectURL(videoFile);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        setUploading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image: res.data.imageUrl });
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const url = URL.createObjectURL(file);
        setVideoPreview(url);

        // Upload video to server
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        setUploadingVideo(true);
        try {
            const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Set video URL
            const videoUrl = res.data.imageUrl;

            // If no image is uploaded, generate thumbnail from video
            if (!formData.image && !imagePreview) {
                try {
                    const thumbnailBlob = await generateVideoThumbnail(file);

                    // Upload thumbnail as the cover image
                    const thumbnailFormData = new FormData();
                    thumbnailFormData.append('image', thumbnailBlob, 'video-thumbnail.jpg');

                    const thumbnailRes = await axios.post('http://localhost:5000/api/upload', thumbnailFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    // Set both video and auto-generated image
                    setFormData({ ...formData, video: videoUrl, image: thumbnailRes.data.imageUrl });
                    setImagePreview(thumbnailRes.data.imageUrl);
                } catch (thumbnailErr) {
                    console.error('Error generating thumbnail:', thumbnailErr);
                    // Just set video URL if thumbnail generation fails
                    setFormData({ ...formData, video: videoUrl });
                }
            } else {
                // Image already exists, just set video URL
                setFormData({ ...formData, video: videoUrl });
            }
        } catch (err) {
            console.error('Error uploading video:', err);
            alert('Failed to upload video');
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/news', formData);
            setShowForm(false);
            setFormData({ title: '', summary: '', content: '', category: 'General', image: '', video: '' });
            setImagePreview('');
            setVideoPreview('');
            fetchNews();
        } catch (err) {
            console.error('Error creating news:', err);
        }
    };

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">Manage your news articles and content</p>
                </div>
                <button onClick={() => setShowForm(true)} className="admin-add-btn">
                    <Plus size={20} />
                    Add News
                </button>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">Create New Article</h2>
                            <button onClick={() => setShowForm(false)} className="admin-modal-close">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label className="admin-label">Article Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="admin-input"
                                    placeholder="Enter article title..."
                                    required
                                />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label className="admin-label">Category</label>
                                    <div className="admin-select-wrapper">
                                        <Tag size={16} className="admin-select-icon" />
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="admin-select"
                                        >
                                            <option>General</option>
                                            <option>India</option>
                                            <option>World</option>
                                            <option>Politics</option>
                                            <option>Technology</option>
                                            <option>Entertainment</option>
                                            <option>Sports</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="admin-form-group">
                                <label className="admin-label">
                                    Article Image (Optional)
                                    {videoPreview && !imagePreview && (
                                        <span style={{ fontSize: '0.85em', color: '#10b981', marginLeft: '0.5rem' }}>
                                            ✓ Will auto-generate from video
                                        </span>
                                    )}
                                </label>
                                <div className="admin-image-upload">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="admin-file-input"
                                    />
                                    <label htmlFor="image-upload" className="admin-upload-label">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="admin-image-preview" />
                                        ) : (
                                            <div className="admin-upload-placeholder">
                                                <ImageIcon size={48} />
                                                <p>{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                                                <span>JPG, PNG, GIF up to 5MB (or auto-generated from video)</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Video Upload */}
                            <div className="admin-form-group">
                                <label className="admin-label">Article Video (Optional)</label>
                                <div className="admin-image-upload">
                                    <input
                                        type="file"
                                        id="video-upload"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        className="admin-file-input"
                                    />
                                    <label htmlFor="video-upload" className="admin-upload-label">
                                        {videoPreview ? (
                                            <video src={videoPreview} controls className="admin-image-preview" style={{ maxHeight: '200px' }} />
                                        ) : (
                                            <div className="admin-upload-placeholder">
                                                <Upload size={48} />
                                                <p>{uploadingVideo ? 'Uploading...' : 'Click to upload video'}</p>
                                                <span>MP4, WebM up to 50MB</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Summary</label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="admin-textarea"
                                    rows="3"
                                    placeholder="Brief summary of the article..."
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Full Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="admin-textarea"
                                    rows="8"
                                    placeholder="Write the full article content here..."
                                    required
                                />
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" onClick={() => setShowForm(false)} className="admin-btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn-submit" disabled={uploading || uploadingVideo}>
                                    {uploading ? 'Uploading Image...' : uploadingVideo ? 'Uploading Video...' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* News Table */}
            <div className="admin-table-container">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>News Articles</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.map((news) => (
                            <tr key={news._id}>
                                <td className="admin-table-title">{news.title}</td>
                                <td>
                                    <span className="admin-category-badge">{news.category}</span>
                                </td>
                                <td className="admin-table-date">
                                    <Calendar size={14} />
                                    {new Date(news.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(news._id)} className="admin-delete-btn" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {newsList.length === 0 && (
                            <tr>
                                <td colSpan="4" className="admin-table-empty">
                                    No news articles found. Click "Add News" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Comment Moderation Section */}
            <div className="admin-comments-section" style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Recent Comments</h2>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Comment</th>
                                <th>Article</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commentsList.map((comment) => (
                                <tr key={comment._id}>
                                    <td style={{ fontWeight: '600' }}>{comment.username}</td>
                                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {comment.content}
                                    </td>
                                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#3b82f6' }}>
                                        {comment.newsId?.title || 'Unknown Article'}
                                    </td>
                                    <td className="admin-table-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="admin-delete-btn"
                                            title="Delete Comment"
                                            style={{ color: '#ef4444' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {commentsList.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="admin-table-empty">
                                        No comments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Newsletter Subscribers Section */}
            <div className="admin-comments-section" style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>Newsletter Subscribers</h2>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Subscribed On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribersList.map((subscriber) => (
                                <tr key={subscriber._id}>
                                    <td style={{ fontWeight: '600', color: '#3b82f6' }}>
                                        {subscriber.email}
                                    </td>
                                    <td className="admin-table-date">
                                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteSubscriber(subscriber._id)}
                                            className="admin-delete-btn"
                                            title="Remove Subscriber"
                                            style={{ color: '#ef4444' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {subscribersList.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="admin-table-empty">
                                        No subscribers yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
