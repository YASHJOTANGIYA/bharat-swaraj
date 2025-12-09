import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BreakingNewsTicker from './BreakingNewsTicker';
import './Layout.css';

const Layout = ({ children }) => {
    // Default to closed on mobile (less than 1024px), open on desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="layout">
            <BreakingNewsTicker />
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="layout-container">
                <div
                    className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
                    onClick={closeSidebar}
                ></div>
                <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                <main className={`layout-main ${isSidebarOpen ? 'layout-main-shifted' : ''}`}>
                    <div className="layout-content">
                        {children}
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
