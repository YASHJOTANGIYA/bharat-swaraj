import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFViewerModal.css';

// Configure PDF.js worker
// We use a CDN to avoid complex build configurations with Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewerModal = ({ url, title, onClose }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function handleDownload() {
        window.open(url, '_blank');
    }

    return (
        <div className="pdf-modal-overlay">
            <div className="pdf-modal-container">
                <div className="pdf-modal-header">
                    <h3 className="pdf-modal-title">{title}</h3>
                    <div className="pdf-modal-controls">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} title="Zoom Out">
                            <ZoomOut size={20} />
                        </button>
                        <span className="scale-display">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} title="Zoom In">
                            <ZoomIn size={20} />
                        </button>
                        <div className="divider"></div>
                        <button onClick={handleDownload} title="Download">
                            <Download size={20} />
                        </button>
                        <button onClick={onClose} title="Close">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="pdf-modal-content">
                    {loading && <div className="pdf-loading">Loading PDF...</div>}

                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => console.error('Error loading PDF:', error)}
                        loading={<div className="pdf-loading">Loading Document...</div>}
                        className="pdf-document"
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    </Document>
                </div>

                {numPages && (
                    <div className="pdf-modal-footer">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={previousPage}
                            className="nav-btn"
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={nextPage}
                            className="nav-btn"
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewerModal;
