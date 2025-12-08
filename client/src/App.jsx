import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Category from './pages/Category';
import Article from './pages/Article';
import Trending from './pages/Trending';
import Saved from './pages/Saved';
import SearchResults from './pages/SearchResults';
import EContent from './pages/EContent';
import GoogleCallback from './pages/GoogleCallback';
import StaticPage from './pages/StaticPage';
import { aboutContent, contactContent, privacyContent, termsContent, cookieContent } from './data/staticContent';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" style={{ zIndex: 99999 }} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/news/:id" element={<Article />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/e-content/:city" element={<EContent />} />

          {/* Static Pages */}
          <Route path="/about" element={<StaticPage title="About Us" content={aboutContent} />} />
          <Route path="/contact" element={<StaticPage title="Contact Us" content={contactContent} />} />
          <Route path="/privacy" element={<StaticPage title="Privacy Policy" content={privacyContent} />} />
          <Route path="/terms" element={<StaticPage title="Terms of Service" content={termsContent} />} />
          <Route path="/cookie-policy" element={<StaticPage title="Cookie Policy" content={cookieContent} />} />

          {/* Add more routes as needed */}
          <Route path="*" element={<div className="text-center py-20">Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
