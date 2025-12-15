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
    const [pdfFile, setPdfFile] = useState(null);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        let active = true;
        const loadPdf = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch as blob to bypass some CORS issues and ensure stable loading
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                if (active) {
                    setPdfFile(blobUrl);
                }
            } catch (err) {
                console.error('Error preparing PDF:', err);
                if (active) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        if (url) {
            loadPdf();
        }

        return () => {
            active = false;
            if (pdfFile && pdfFile.startsWith('blob:')) {
                URL.revokeObjectURL(pdfFile);
            }
        };
    }, [url]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(err) {
        console.error('PDF Load Error:', err);
        setError('Failed to load PDF document. It might be corrupted or restricted.');
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
                    {loading && !error && <div className="pdf-loading">Loading PDF...</div>}
                    {error && (
                        <div className="pdf-error">
                            <p>{error}</p>
                            <button onClick={handleDownload} className="nav-btn">
                                Download to View
                            </button>
                        </div>
                    )}

                    {pdfFile && !error && (
                        <Document
                            file={pdfFile}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={<div className="pdf-loading">Rendering...</div>}
                            className="pdf-document"
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </Document>
                    )}
                </div>

                {numPages && !loading && !error && (
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
