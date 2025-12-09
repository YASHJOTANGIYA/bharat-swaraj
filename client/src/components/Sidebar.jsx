import React from 'react';
import { Home, Globe, TrendingUp, Cpu, Shield, PlayCircle, Bookmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const location = useLocation();

    const links = [
        { name: 'Top Stories', icon: Home, path: '/' },
        { name: 'India', icon: Globe, path: '/category/india' },
        { name: 'World', icon: Globe, path: '/category/world' },
        { name: 'Politics', icon: Shield, path: '/category/politics' },
        { name: 'Technology', icon: Cpu, path: '/category/technology' },
        { name: 'Entertainment', icon: PlayCircle, path: '/category/entertainment' },
        { name: 'Sports', icon: TrendingUp, path: '/category/sports' },
        { name: 'Trending', icon: TrendingUp, path: '/trending' },
        { name: 'Saved', icon: Bookmark, path: '/saved' },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="sidebar-content">
                <ul className="sidebar-list">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                                    onClick={closeSidebar}
                                >
                                    <Icon size={20} />
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
