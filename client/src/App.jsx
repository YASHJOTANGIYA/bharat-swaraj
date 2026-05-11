import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { aboutContent, contactContent, privacyContent, termsContent, cookieContent } from './data/staticContent';

// Lazy loading components for Performance Optimization (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Admin = lazy(() => import('./pages/Admin'));
const Category = lazy(() => import('./pages/Category'));
const Article = lazy(() => import('./pages/Article'));
const Trending = lazy(() => import('./pages/Trending'));
const Shorts = lazy(() => import('./pages/Shorts'));
const Saved = lazy(() => import('./pages/Saved'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const EContent = lazy(() => import('./pages/EContent'));
const GoogleCallback = lazy(() => import('./pages/GoogleCallback'));
const StaticPage = lazy(() => import('./pages/StaticPage'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-black text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

// Handles Google OAuth token passed via root URL (?google_token=...)
// This avoids SPA routing issues on Vercel for /auth/google/callback
function GoogleTokenHandler() {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('google_token');
    const userStr = params.get('google_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
        // Clean the URL so token doesn't stay in address bar
        window.history.replaceState({}, document.title, '/');
      } catch (err) {
        console.error('Google token parse error:', err);
      }
    }
  }, []);
  return null;
}

function App() {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <GoogleTokenHandler />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" style={{ zIndex: 99999 }} />
      <Layout>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/shorts" element={<Shorts />} />
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
            <Route path="*" element={<div className="text-center py-20 text-white">Page Not Found</div>} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
