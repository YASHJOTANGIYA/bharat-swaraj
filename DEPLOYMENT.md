# Bharat Swaraj - Deployment Guide

## Overview
This guide will help you deploy Bharat Swaraj website with:
- **Frontend (Client)**: Vercel
- **Backend (Server)**: Render or Railway
- **Database**: MongoDB Atlas

---

## Prerequisites

1. Create accounts on:
   - [Vercel](https://vercel.com) - For frontend hosting
   - [Render](https://render.com) or [Railway](https://railway.app) - For backend hosting
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Already done

2. Install Git (if not already):
   ```bash
   winget install Git.Git
   ```

---

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository

```bash
cd "c:\Users\Tirth Jotangiya\OneDrive\Desktop\Bharat Swaraj"
git init
git add .
git commit -m "Initial commit - Bharat Swaraj"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `bharat-swaraj`
2. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/bharat-swaraj.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend (Server) on Render

### 2.1 Create a Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2.2 Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `bharat-swaraj-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   YOUTUBE_API_KEY=your_youtube_api_key
   WEATHER_API_KEY=your_weather_api_key
   ```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://bharat-swaraj-api.onrender.com`)

---

## Step 3: Deploy Frontend (Client) on Vercel

### 3.1 Create Environment Variable File

Create `client/.env.production`:

```env
VITE_API_URL=https://bharat-swaraj-api.onrender.com
```

### 3.2 Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
npm install -g vercel
cd client
vercel
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://bharat-swaraj-api.onrender.com`
6. Click "Deploy"

---

## Step 4: Update Backend CORS

After frontend deployment, update `server/index.js`:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://your-vercel-domain.vercel.app'  // Add your Vercel URL
    ],
    credentials: true
};
app.use(cors(corsOptions));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes.

---

## Step 5: Configure Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render (Backend):
1. Go to Dashboard → Your Service → Settings
2. Add custom domain
3. Update DNS records

---

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Test all features:
   - ✅ Homepage loads
   - ✅ Login/Register works
   - ✅ News articles display
   - ✅ YouTube videos load
   - ✅ Admin panel works
   - ✅ Comments feature
   - ✅ Newsletter subscription

---

## Step 7: Enable Automatic Deployments

Both Vercel and Render will automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push
```

---

## Troubleshooting

### Issue: API not connecting
- Check environment variables in Vercel
- Verify CORS settings in backend
- Check browser console for errors

### Issue: MongoDB connection failed
- Verify MongoDB Atlas whitelist (allow 0.0.0.0/0 for Render)
- Check connection string in Render environment variables

### Issue: Images not loading
- Ensure upload directory is configured correctly
- Consider using cloud storage (Cloudinary) for production

---

## Production Checklist

- [ ] MongoDB Atlas configured
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured for production
- [ ] Test all features
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled (automatic on Vercel/Render)

---

## Monitoring & Maintenance

- **Render**: View logs in dashboard
- **Vercel**: View deployment logs and analytics
- **MongoDB Atlas**: Monitor database usage

---

## Alternative: Deploy Backend on Railway

If you prefer Railway over Render:

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select repository → select `server` folder
4. Add environment variables
5. Deploy

Railway is often faster than Render's free tier.

---

## Cost Estimate

- **Vercel**: Free (with usage limits)
- **Render**: Free (sleeps after 15 min inactivity)
- **Railway**: $5/month credit (free trial)
- **MongoDB Atlas**: Free tier (512MB)

**Total**: FREE for testing, ~$5-10/month for production

---

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors

---

** Happy Deploying! 🚀 **
