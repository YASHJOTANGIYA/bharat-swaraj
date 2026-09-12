# Hosting and Domain Guide for Bharat Swaraj

Currently, your website is **already hosted** and live!
*   **Frontend**: Hosted on **Vercel** (Free) -> `https://bharat-swaraj.vercel.app`
*   **Backend**: Hosted on **Render** (Free) -> `https://bharat-swaraj.onrender.com`

You do **not** need to pay for hosting right now. However, if you want a professional name like `bharatswaraj.com` instead of `bharat-swaraj.vercel.app`, you need to buy a **Custom Domain**.

## How to Get a Custom Domain (e.g., .com, .in)

### Step 1: Buy a Domain
You can buy a domain name from registrars like:
*   **GoDaddy** (Popular in India)
*   **Namecheap** (Good prices)
*   **Hostinger**
*   **BigRock**

**Cost**: Usually ₹500 - ₹1000 per year for a `.com` or `.in` domain.

### Step 2: Connect Domain to Vercel
Once you buy the domain (e.g., `bharatswaraj.com`), you don't need to buy "hosting" from GoDaddy. You just connect the domain to your existing Vercel hosting.

1.  Go to your **Vercel Dashboard**.
2.  Select your project (`bharat-swaraj`).
3.  Go to **Settings** -> **Domains**.
4.  Enter your new domain (e.g., `bharatswaraj.com`) and click **Add**.
5.  Vercel will give you some **DNS Records** (usually an A Record and a CNAME).
6.  Go to your Domain Registrar (e.g., GoDaddy) -> **DNS Management**.
7.  Add the records Vercel gave you.
8.  Wait 24 hours for it to propagate.

### Step 3: Important Updates After Changing Domain
If you switch to a custom domain, you **MUST** update a few things:

1.  **Google OAuth**:
    *   Go to Google Cloud Console.
    *   Add your new domain (`https://bharatswaraj.com`) to "Authorized JavaScript origins".
    *   **Note**: Your backend URL (`onrender.com`) stays the same, so you don't need to change the redirect URI unless you also move the backend.

2.  **SEO / Google Search Console**:
    *   Add the new domain property to Google Search Console.

3.  **Frontend Code**:
    *   Update `client/src/components/SEO.jsx` with the new URL.
    *   Update `client/public/sitemap.xml` with the new URL.

## Summary
*   **Hosting**: FREE (Vercel + Render). No action needed.
*   **Domain**: Optional. Buy if you want a professional brand name.
