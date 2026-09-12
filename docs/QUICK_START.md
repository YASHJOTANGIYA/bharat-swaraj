# 🚀 Quick Start - Deploy Bharat Swaraj

## ✅ Completed Steps

1. ✅ Git repository initialized
2. ✅ Code committed to Git
3. ✅ `.gitignore` created
4. ✅ Deployment guide created

---

## 📋 Next Steps (Follow in Order)

### **Step 1: Create GitHub Repository** (5 minutes)

1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `bharat-swaraj`
4. Make it **Public** (required for free Vercel)
5. Don't add README, .gitignore, or license (we already have them)
6. Click **"Create repository"**

7. Copy the commands shown and run them:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bharat-swaraj.git
   git branch -M main
   git push -u origin main
   ```

---

### **Step 2: Deploy Backend on Render** (10 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account
5. Select `bharat-swaraj` repository
6. Configure:
   - **Name**: `bharat-swaraj-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

7. **Environment Variables** - Click "Add Environment Variable" and add:
   ```
   MONGODB_URI = (your MongoDB connection string from server/.env)
   JWT_SECRET = (your JWT secret from server/.env)
   PORT = 5000
   YOUTUBE_API_KEY = (your YouTube key from server/.env)
   WEATHER_API_KEY = (your Weather key from server/.env)
   ```

8. Click **"Create Web Service"**
9. Wait 5-10 minutes for deployment
10. **Copy your backend URL** (e.g., `https://bharat-swaraj-api.onrender.com`)

---

### **Step 3: Update CORS in Backend** (2 minutes)

After Render deployment completes:

1. Open `server/index.js` in your editor
2. Find the `corsOptions` section (around line 15)
3. Update it to include your Vercel domain (we'll add it in Step 5):
   ```javascript
   const corsOptions = {
       origin: [
           'http://localhost:5173',
           'https://your-app-name.vercel.app'  // You'll update this later
       ],
       credentials: true
   };
   ```
4. Save, commit, and push:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```
5. Render will auto-deploy (takes 2-3 minutes)

---

### **Step 4: Create Production Environment File** (1 minute)

In the `client` folder:

1. Copy `.env.production.example` to `.env.production`
2. Update `VITE_API_URL` with your Render backend URL:
   ```
   VITE_API_URL=https://bharat-swaraj-api.onrender.com
   ```
3. Save the file

---

### **Step 5: Deploy Frontend on Vercel** (7 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your `bharat-swaraj` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`  (⚠️ Important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Environment Variables**:
   - Click "Add Environment Variable"
   - Key: `VITE_API_URL`
   - Value: `https://bharat-swaraj-api.onrender.com` (your Render URL)

7. Click **"Deploy"**
8. Wait 2-5 minutes
9. **Copy your Vercel URL** (e.g., `https://bharat-swaraj.vercel.app`)

---

### **Step 6: Update CORS with Vercel URL** (2 minutes)

1. Go back to `server/index.js`
2. Update the CORS origin with your actual Vercel URL:
   ```javascript
   const corsOptions = {
       origin: [
           'http://localhost:5173',
           'https://bharat-swaraj.vercel.app'  // Your actual Vercel URL
       ],
       credentials: true
   };
   ```
3. Save, commit, and push:
   ```bash
   git add .
   git commit -m "Add Vercel URL to CORS"
   git push
   ```

---

### **Step 7: Configure MongoDB Atlas** (3 minutes)

1. Go to https://cloud.mongodb.com
2. Select your cluster → **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

This allows Render to connect to your database.

---

### **Step 8: Test Your Live Website!** (5 minutes)

Visit your Vercel URL and test:

- ✅ Homepage loads
- ✅ News articles display
- ✅ Login/Register works
- ✅ Admin panel accessible
- ✅ YouTube videos play
- ✅ Comments work
- ✅ Newsletter subscription works
- ✅ Weather widget displays
- ✅ Horoscope shows
- ✅ Search functionality works

---

## 🎉 Deployment Complete!

Your website is now live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-api.onrender.com

---

## 🔄 Making Changes in the Future

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Both Vercel and Render will automatically deploy your changes!

---

## ⚠️ Important Notes

1. **Render Free Tier**: Your backend will sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

2. **MongoDB Atlas Free Tier**: Limited to 512MB storage. Monitor usage in Atlas dashboard.

3. **File Uploads**: Currently stored locally on Render. For production, consider using:
   - [Cloudinary](https://cloudinary.com) - Free tier for images
   - [AWS S3](https://aws.amazon.com/s3/) - For larger files

4. **YouTube Sync**: The scheduler will run on Render, but may not work perfectly on free tier due to sleeping. Consider upgrading to paid plan for 24/7 uptime.

---

## 💰 Cost Breakdown

- **Vercel**: FREE forever (with limits)
- **Render**: FREE (with sleeping after 15 min)
- **MongoDB Atlas**: FREE (512MB limit)
- **Total**: $0/month for testing

For production with no sleeping:
- **Render**: $7/month
- **Vercel**: FREE
- **MongoDB**: FREE or $9/month for more storage
- **Total**: $7-16/month

---

## 🆘 Troubleshooting

### Frontend not connecting to backend:
1. Check browser console for errors
2. Verify `VITE_API_URL` in Vercel settings
3. Verify CORS includes your Vercel URL

### Backend not starting:
1. Check Render logs
2. Verify all environment variables are set
3. Check MongoDB connection string

### Database connection failed:
1. Check MongoDB Atlas is allowing 0.0.0.0/0
2. Verify connection string in Render env vars
3. Check if database user has correct permissions

---

## 📚 Additional Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

**Need help?** Check the deployment logs:
- Vercel: Project → Deployments → Select latest → View logs
- Render: Dashboard → Service → Logs tab
