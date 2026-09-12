# 📰 How to View Your News Articles - Step by Step Guide

## 🎯 Quick Overview
Your news articles are stored in **MongoDB database** and displayed on your website.

---

## 📍 Method 1: View Through Your Website (Recommended)

### Step 1: Start Your Servers
Make sure both servers are running:

**Terminal 1 - Backend:**
```bash
cd "c:\Users\Tirth Jotangiya\OneDrive\Desktop\Bharat Swaraj\server"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\Tirth Jotangiya\OneDrive\Desktop\Bharat Swaraj\client"
npm run dev
```

### Step 2: Open Your Website
1. Open browser
2. Go to: `http://localhost:5173`
3. You'll see the home page with "Top Stories"

### Step 3: View All News
- **Home Page** → Shows all news articles
- **Sidebar Categories** → Click any category (India, World, Sports, etc.)
- **Trending** → Click "Trending Now" or sidebar "Trending"
- **Saved** → Click "Saved" in sidebar to see bookmarked articles

### Step 4: Add New News
1. Click **"Admin"** button (top right)
2. Click **"+ Add News"** button
3. Fill in the form:
   - Title
   - Category (dropdown)
   - Upload Image (click to browse)
   - Summary
   - Full Content
4. Click **"Publish Article"**
5. Go back to home → Your article appears!

---

## 📍 Method 2: View Database Directly

### Option A: Using the Script I Created

Run this command in your server folder:
```bash
cd "c:\Users\Tirth Jotangiya\OneDrive\Desktop\Bharat Swaraj\server"
node viewDatabase.js
```

This will show:
- ✅ All collections in your database
- ✅ Total number of articles
- ✅ List of all articles with titles, categories, and dates

### Option B: Using MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass** (if not installed):
   - Go to: https://www.mongodb.com/try/download/compass
   - Download and install

2. **Connect to Database:**
   - Open MongoDB Compass
   - Connection String: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Your Data:**
   - Click database: `bharat_swaraj`
   - Click collection: `news`
   - You'll see all your articles!

### Option C: Using MongoDB Shell

```bash
# Open MongoDB Shell
mongosh

# Switch to your database
use bharat_swaraj

# View all news
db.news.find().pretty()

# Count articles
db.news.countDocuments()

# Exit
exit
```

---

## 🗂️ Data Storage Locations

### News Articles:
- **Database**: MongoDB
- **Database Name**: `bharat_swaraj`
- **Collection**: `news`
- **Location**: `C:\data\db` (default MongoDB data folder)

### Uploaded Images:
- **Folder**: `Bharat Swaraj\server\uploads\`
- **Access URL**: `http://localhost:5000/uploads/filename.jpg`

### Saved/Bookmarked Articles:
- **Location**: Browser localStorage
- **Key**: `savedArticles`
- **To view**: Press F12 → Application tab → Local Storage → http://localhost:5173

---

## 🔧 Troubleshooting

### "No news articles found"
**Solution**: Add news through Admin panel
1. Go to `http://localhost:5173/admin`
2. Click "+ Add News"
3. Fill form and publish

### "Cannot connect to database"
**Solution**: Make sure MongoDB is running
```bash
# Start MongoDB
mongod
```

### "Images not showing"
**Solution**: Check uploads folder exists
- Location: `server/uploads/`
- If missing, it will be created automatically when you upload

---

## 📊 Current Database Info

**Connection String**: `mongodb://localhost:27017/bharat_swaraj`

**Collections**:
- `news` - Your news articles
- `users` - User accounts (for login)

**To check if MongoDB is running**:
```bash
mongosh --eval "db.adminCommand('ping')"
```

If you see `{ ok: 1 }`, MongoDB is running! ✅

---

## 🎓 Quick Commands Reference

```bash
# View all news in database
cd server
node viewDatabase.js

# Start MongoDB
mongod

# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Start backend server
cd server
npm run dev

# Start frontend
cd client
npm run dev
```

---

Need help? Just ask! 😊
