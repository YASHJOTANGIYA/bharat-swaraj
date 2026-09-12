# 🚀 Deployment Guide: Bharat Swaraj

Your frontend is already deployed on Vercel, but it needs a live backend server to work. Follow these steps to deploy your server and connect everything.

## Phase 1: Deploy Server to Render (Free)

1.  **Create an Account**: Go to [render.com](https://render.com/) and sign up (you can use your GitHub account).
2.  **New Web Service**:
    *   Click on the **"New +"** button and select **"Web Service"**.
    *   Select **"Build and deploy from a Git repository"**.
    *   Connect your GitHub account and select the **`bharat-swaraj`** repository.
3.  **Configure the Service**:
    *   **Name**: `bharat-swaraj-api` (or anything you like).
    *   **Region**: Choose the one closest to you (e.g., Singapore or Frankfurt).
    *   **Branch**: `main`
    *   **Root Directory**: `server` (Important! Type `server` here because your backend code is in the server folder).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Instance Type**: Select **"Free"**.
4.  **Environment Variables**:
    *   Scroll down to the **"Environment Variables"** section.
    *   Add the following variables (copy them from your local `server/.env` file):
        *   `MONGO_URI`: Your MongoDB Connection String (must be a cloud URL like MongoDB Atlas, not `localhost`).
        *   `JWT_SECRET`: Your secret key.
        *   `YOUTUBE_API_KEY`: Your YouTube API key.
        *   `CLIENT_URL`: `https://bharat-swaraj-8c29.vercel.app` (Your Vercel frontend URL).
5.  **Deploy**: Click **"Create Web Service"**.

Render will now build and deploy your server. It might take a few minutes. Once done, you will see a URL at the top (e.g., `https://bharat-swaraj-api.onrender.com`). **Copy this URL.**

---

## Phase 2: Connect Frontend to Backend

Now we need to tell your Vercel frontend where the server is.

1.  Go to your **Vercel Dashboard**.
2.  Select the **Bharat Swaraj** project.
3.  Go to **Settings** > **Environment Variables**.
4.  Add a new variable:
    *   **Key**: `VITE_API_URL`
    *   **Value**: Paste your Render Server URL here (e.g., `https://bharat-swaraj-api.onrender.com`).
        *   *Note: Do not add a trailing slash `/` at the end.*
5.  **Save**.
6.  Go to the **Deployments** tab and **Redeploy** your latest commit (or just push a small change to trigger a new deployment).

---

## Phase 3: Verify

1.  Open your Vercel website link.
2.  The news should now load!
3.  Try logging in to verify the connection.

**Note on Free Tier**: Render's free tier spins down after inactivity. The first request might take 30-60 seconds to load while the server wakes up. This is normal for the free plan.
