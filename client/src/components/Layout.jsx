import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BreakingNewsTicker from './BreakingNewsTicker';
import './Layout.css';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout">
            <BreakingNewsTicker />
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="layout-container">
                <Sidebar isOpen={isSidebarOpen} />
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
