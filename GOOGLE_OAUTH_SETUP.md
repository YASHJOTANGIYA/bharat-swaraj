# Google OAuth Setup Guide for Bharat Swaraj

## Overview
This guide explains how to set up Google OAuth authentication ("Continue with Google") for the Bharat Swaraj website.

## What Was Implemented

### Backend Changes:
1. **Installed Dependencies**: `passport` and `passport-google-oauth20`
2. **Updated User Model**: Added `googleId` field and made password optional for OAuth users
3. **Created Passport Configuration**: `/server/config/passport.js` handles Google OAuth strategy
4. **Updated Auth Controller**: Added `googleCallback` function to handle OAuth success
5. **Updated Auth Routes**: Added `/api/auth/google` and `/api/auth/google/callback` routes
6. **Updated Server**: Initialized passport middleware in `index.js`

### Frontend Changes:
1. **Created Google Callback Page**: `/client/src/pages/GoogleCallback.jsx` handles OAuth redirect
2. **Updated App Routes**: Added route for `/auth/google/callback`
3. **Updated Login Page**: Added "Continue with Google" button with premium styling
4. **Updated Login CSS**: Added styles for Google button and OR divider

## How to Set Up Google OAuth Credentials

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" → "New Project"
3. Enter project name: "Bharat Swaraj" (or any name you prefer)
4. Click "Create"

### Step 2: Enable Google+ API

1. In your project dashboard, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Bharat Swaraj
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (we'll use default scopes)
   - Test users: Add your email for testing
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Bharat Swaraj Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Click "Create"

5. Copy your credentials:
   - **Client ID**: Looks like `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: A random string

### Step 4: Update Environment Variables

1. Open `/server/.env` file
2. Replace the placeholder values:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### Step 5: Restart the Server

```bash
cd server
npm run dev
```

## How It Works

### User Flow:

1. User clicks "Continue with Google" button on login page
2. User is redirected to Google's OAuth consent screen
3. User selects their Google account and grants permissions
4. Google redirects back to: `http://localhost:5000/api/auth/google/callback`
5. Backend creates/finds user and generates JWT token
6. Backend redirects to: `http://localhost:5173/auth/google/callback?token=...&user=...`
7. Frontend stores token and user data in localStorage
8. User is redirected to home page

### Database Behavior:

- **New User**: Creates a new user with `googleId` and no password
- **Existing User (same email)**: Links Google account to existing user
- **Returning OAuth User**: Logs in using existing Google account

## Testing

1. Make sure both frontend and backend servers are running:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. Navigate to `http://localhost:5173/login`
3. Click "Continue with Google"
4. Select your Google account
5. Grant permissions
6. You should be redirected to the home page, logged in

## Production Deployment

When deploying to production:

1. Update authorized origins and redirect URIs in Google Cloud Console:
   - Add your production domain (e.g., `https://bharatswaraj.com`)
   - Add production callback URL (e.g., `https://bharatswaraj.com/api/auth/google/callback`)

2. Update environment variables in production:
   - Use the same Client ID and Secret
   - Or create separate credentials for production

3. Update URLs in code:
   - `/server/controllers/authController.js`: Update redirect URLs
   - `/client/src/pages/Login.jsx`: Update API endpoint

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:5000/api/auth/google/callback`
- Check for trailing slashes

### Error: "Access blocked: This app's request is invalid"
- Configure OAuth consent screen properly
- Add your email as a test user

### User not redirected after Google login
- Check browser console for errors
- Verify frontend callback route is set up correctly
- Check that token is being generated in backend

### "Authentication failed" error
- Check MongoDB connection
- Verify JWT_SECRET is set in .env
- Check server logs for detailed error messages

## Security Notes

1. **Never commit `.env` file** to version control
2. Keep Client Secret confidential
3. Use HTTPS in production
4. Regularly rotate secrets
5. Implement rate limiting on auth endpoints
6. Add CSRF protection for production

## Features

- ✅ One-click Google sign-in
- ✅ Automatic user creation
- ✅ Account linking (if email exists)
- ✅ Secure JWT token generation
- ✅ Premium UI design
- ✅ Error handling
- ✅ Seamless redirect flow

## File Structure

```
server/
├── config/
│   └── passport.js          # Passport Google OAuth strategy
├── controllers/
│   └── authController.js    # Added googleCallback function
├── models/
│   └── User.js             # Updated with googleId field
├── routes/
│   └── auth.js             # Added Google OAuth routes
├── .env                    # Google credentials
└── index.js                # Passport initialization

client/
├── src/
│   ├── pages/
│   │   ├── Login.jsx       # Added Google button
│   │   ├── Login.css       # Google button styles
│   │   └── GoogleCallback.jsx  # OAuth callback handler
│   └── App.jsx             # Added callback route
```

## Next Steps

1. Get Google OAuth credentials from Google Cloud Console
2. Update `.env` file with actual credentials
3. Test the login flow
4. Consider adding Google sign-in to Register page as well
5. Add user profile picture from Google (optional)
6. Implement "Sign in with Google" for mobile apps (optional)

---

**Note**: This implementation uses Passport.js which is a robust and widely-used authentication middleware for Node.js. The setup follows industry best practices for OAuth 2.0 implementation.
