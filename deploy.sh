#!/bin/bash

echo "🚀 Bharat Swaraj - Quick Deployment Script"
echo "==========================================="
echo ""

# Check if GitHub repo is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ GitHub repository not connected!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Go to https://github.com and create a new repository named 'bharat-swaraj'"
    echo "2. Run the following commands:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/bharat-swaraj.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

echo "✅ Git repository initialized"
echo "✅ Code committed"
echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Backend Deployment (Render/Railway):"
echo "  [ ] Create account on Render.com or Railway.app"
echo "  [ ] Deploy from GitHub repository"
echo "  [ ] Set root directory to 'server'"
echo "  [ ] Add environment variables (see server/.env)"
echo "  [ ] Copy backend URL"
echo ""
echo "Frontend Deployment (Vercel):"
echo "  [ ] Create account on Vercel.com"
echo "  [ ] Import GitHub repository"
echo "  [ ] Set root directory to 'client'"
echo "  [ ] Add VITE_API_URL environment variable"
echo "  [ ] Deploy"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
