# IMMERSE LUME — VERCEL DEPLOYMENT GUIDE (ZERO-CONFIGURATION)

This project has been pre-configured to be **100% Vercel-Ready**. You do not need to configure build scripts, routes, or server proxies manually.

---

### Method 1: Deploy with 1-Click via Git (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Immerse Lume Luxury Brand Website"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New"** > **"Project"**.
   - Select your Immerse Lume repository and click **"Import"**.

3. **Verify Settings (Vercel automatically detects these from `vercel.json`)**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Click "Deploy"**:
   - Vercel will build the frontend assets into `/dist` and automatically provision the serverless API routes under `/api/index.ts`.
   - Your site will be live on an HTTPS `.vercel.app` domain in less than 60 seconds!

---

### (Optional) Cloud Database Connection (Supabase)

The app works autonomously out-of-the-box with full admin authentication and catalogue browsing. 

If you want cloud-hosted database persistence across distributed serverless regions:
1. In your Vercel Project Dashboard, navigate to **Settings** > **Environment Variables**.
2. Add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_KEY` = your Supabase anon or service role key
3. Copy the ready-made SQL schema from **Admin Panel > Database Hub** into your Supabase SQL Editor.

---

### Default Admin Credentials

- **Admin URL**: `https://your-domain.vercel.app/admin`
- **Username**: `admin`
- **Password**: `ImmerseLume2026!`
*(You can securely update this password inside the Admin Panel under Brand & Design > Security)*
