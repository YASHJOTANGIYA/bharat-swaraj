# How to Setup Google OAuth for Bharat Swaraj

Your screenshot shows that you don't have an **OAuth 2.0 Client ID** yet. You need to create one to get the keys for Google Login.

## Step 1: Configure Consent Screen
1. In the Google Cloud Console, click on **"OAuth consent screen"** in the left sidebar.
2. Select **External** and click **Create**.
3. Fill in the required fields:
   - **App name**: Bharat Swaraj
   - **User support email**: Select your email.
   - **Developer contact information**: Enter your email.
4. Click **Save and Continue** through the other steps (Scopes, Test Users) without changing anything for now.
5. Click **Back to Dashboard**.

## Step 2: Create OAuth Client ID
1. Click on **"Credentials"** in the left sidebar.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. **Application type**: Select **Web application**.
4. **Name**: Enter "Bharat Swaraj Web".
5. **Authorized JavaScript origins**:
   - Click **+ ADD URI** and enter: `https://bharat-swaraj.vercel.app`
   - Click **+ ADD URI** again and enter: `http://localhost:5173`
6. **Authorized redirect URIs**:
   - Click **+ ADD URI** and enter: `https://bharat-swaraj.onrender.com/api/auth/google/callback`
   - Click **+ ADD URI** again and enter: `http://localhost:5000/api/auth/google/callback`
7. Click **Create**.

## Step 3: Get Your Keys
1. A popup will appear with your **Client ID** and **Client Secret**.
2. **Copy these keys** and save them somewhere safe.

## Step 4: Add Keys to Render (For Live Site)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click on your **Server** service (`bharat-swaraj`).
3. Click on **Environment**.
4. Add two new variables:
   - Key: `GOOGLE_CLIENT_ID` -> Value: (Paste your Client ID)
   - Key: `GOOGLE_CLIENT_SECRET` -> Value: (Paste your Client Secret)
5. Click **Save Changes**.

## Step 5: Add Keys Locally (For Testing)
1. Open your project in VS Code.
2. Open the file `server/.env`.
3. Add/Update these lines:
   ```env
   GOOGLE_CLIENT_ID=your_pasted_client_id
   GOOGLE_CLIENT_SECRET=your_pasted_client_secret
   ```
4. Restart your server (`npm run dev`).

Now try logging in again!
