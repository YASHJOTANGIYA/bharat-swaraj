# 🇮🇳 Bharat Swaraj (ભારત સ્વરાજ)

> **Official Web Platform for Bharat Swaraj Weekly**  
> Fast, modern news portal built with React, Vite, Node.js, Express, and MongoDB.

---

## 📁 Repository Architecture & Folder Structure

The project is cleanly separated into Frontend, Backend, Documentation, and Automated Workflows:

```text
Bharat Swaraj/
├── client/                     # 🌐 FRONTEND (React + Vite + Tailwind/CSS)
│   ├── public/                 # Static public assets (Favicons, Logo, Manifest)
│   ├── src/                    # React Source Code
│   │   ├── assets/             # Images & static media
│   │   ├── components/         # Reusable UI components (Navbar, NewsCard, Widgets)
│   │   ├── config/             # API configuration
│   │   ├── context/            # React Context providers (Auth, Theme)
│   │   ├── data/               # Static mock & content data
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page routes (Home, Article, Admin, Category, etc.)
│   │   ├── utils/              # Utilities (Image optimization, formatters)
│   │   ├── App.jsx             # Root routing and layout
│   │   └── main.jsx            # React entry point
│   ├── index.html              # HTML shell (Fonts, SEO tags, Preconnect)
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies & scripts
│
├── server/                     # ⚙️ BACKEND (Node.js + Express + MongoDB)
│   ├── config/                 # Passport, DB & Cloudinary configurations
│   ├── controllers/            # Route business logic controllers
│   ├── models/                 # Mongoose schemas (News, User, Comments, Notifications)
│   ├── routes/                 # API endpoints (/api/news, /api/auth, /api/general, etc.)
│   ├── scheduler/              # Automated tasks (YouTube sync)
│   ├── scripts/                # Database & maintenance utility scripts
│   ├── uploads/                # Local uploaded files (if any)
│   ├── index.js                # Express app entry point
│   └── package.json            # Backend dependencies & scripts
│
├── docs/                       # 📚 DOCUMENTATION & GUIDES
│   ├── DEPLOYMENT.md           # Production deployment instructions
│   ├── DEPLOYMENT_GUIDE.md     # Step-by-step setup guide
│   ├── YOUTUBE_SETUP.md        # YouTube API and sync guide
│   ├── GOOGLE_OAUTH_SETUP.md   # Google Authentication setup
│   ├── SEO_GUIDE.md            # Search engine optimization guide
│   └── ...                     # Feature docs and historical change logs
│
└── .github/                    # 🤖 AUTOMATION
    └── workflows/
        └── keep-alive.yml      # Pings Render backend every 12 minutes to prevent sleep
```

---

## ⚡ Speed & Performance Highlights

- **Instant Stale-While-Revalidate**: Cached news loads in 0ms on page open; silent updates occur in the background.
- **Render Keep-Alive**: Automated ping workflow prevents Render free-tier cold starts (50-80s delays eliminated).
- **Auto Image Optimization**: Automatic Cloudinary WebP/AVIF format conversion & width resizing with native lazy loading.
- **Lite Facade for Videos**: Sidebar YouTube player loads an interactive preview poster instead of a heavy 2.5MB iframe.
- **Smart Polling**: Notification and gold rate polling throttled to respectful intervals to avoid server exhaustion.
- **Render-Blocking CSS Eliminated**: Google Fonts loaded via non-blocking `<link rel="stylesheet">` with `preconnect`.

---

## 🚀 Getting Started Locally

### 1. Backend Setup
```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🌐 Production Deployments

- **Frontend**: Hosted on [Vercel](https://vercel.com) (Root Directory: `client`)
- **Backend**: Hosted on [Render](https://render.com) (Root Directory: `server`)
- **Database**: MongoDB Atlas
