# YouTube Integration Setup Guide

## ✅ What's Been Built

I've created a YouTube video fetcher that automatically imports videos from your channel `@bharatswarajweekly2359` as news articles on your website!

## 📋 Features

- ✅ Fetches latest videos from your YouTube channel
- ✅ Converts videos to news articles automatically
- ✅ Stores video thumbnails as news images
- ✅ Saves YouTube video ID for embedding
- ✅ Tracks video views
- ✅ Prevents duplicate imports
- ✅ Assigns videos to "video" category

## 🔧 Setup Steps

### Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### Step 2: Add API Key to .env

Open `server/.env` and replace:
```
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
```

With your actual API key:
```
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Restart Server

Stop and restart your backend server to load the new environment variable.

## 🚀 How to Use

### Method 1: Manual Sync (Recommended for Testing)

Use Postman or any API client to make a POST request:

```
POST http://localhost:5000/api/youtube/sync-youtube
```

This will:
- Fetch the latest 10 videos from your channel
- Convert them to news articles
- Add them to the "video" category
- Return a summary of imported/skipped videos

### Method 2: Auto-Sync (Coming Soon)

I can add a scheduled job to automatically sync videos daily/hourly.

## 📊 API Endpoints

### 1. Sync YouTube Videos
```
POST /api/youtube/sync-youtube
```
**Response:**
```json
{
  "success": true,
  "message": "YouTube sync completed. Imported: 5, Skipped: 0",
  "imported": 5,
  "skipped": 0
}
```

### 2. Get Channel Info
```
GET /api/youtube/youtube-info
```
Returns your channel statistics and information.

## 🎨 How Videos Appear on Website

Videos will appear as regular news articles with:
- **Title**: Video title from YouTube
- **Image**: Video thumbnail (high quality)
- **Content**: Video description
- **Category**: "video"
- **YouTube URL**: Stored for embedding or linking

## 🔄 Changing Video Category

To change which category YouTube videos go into, edit `server/routes/youtube.js` line 62:

```javascript
category: 'video', // Change to 'india', 'sports', etc.
```

## ⚙️ Advanced: Auto-Sync Schedule

If you want automatic syncing, I can add a cron job. Just let me know the frequency:
- Every hour
- Every 6 hours
- Daily at specific time
- etc.

## 🎯 Next Steps

1. Get your YouTube API key
2. Add it to `.env` file
3. Restart server
4. Test the sync endpoint
5. Check your website - videos should appear in the "video" category!

## 📝 Notes

- Free YouTube API quota: 10,000 units/day
- Each sync uses ~100 units
- You can sync ~100 times per day
- Videos are checked for duplicates (won't import twice)
- Summary is optional in News model now (for video descriptions)

## 🆘 Troubleshooting

**Error: "YouTube API key not configured"**
- Make sure you added YOUTUBE_API_KEY to .env
- Restart the server

**Error: "quotaExceeded"**
- You've hit the daily API limit
- Wait until tomorrow or request quota increase

**Videos not showing on website**
- Check if category "video" exists
- Videos are added with category: "video"
- You can filter by this category on your site

---

**Ready to test?** Get your API key and let me know when you're ready to sync! 🚀
