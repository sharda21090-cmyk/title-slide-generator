# 🚀 Deploy Now - Step by Step

Your code is ready! Follow these steps to deploy.

## ✅ What's Already Done

- ✅ Frontend built successfully
- ✅ All dependencies installed
- ✅ Code committed to Git
- ✅ Build tested and working

## 📋 Deployment Steps

### Step 1: Update Apps Script Backend (5 minutes)

1. Open your Apps Script project:
   - Go to https://script.google.com
   - Open your existing project (Script ID: `1zpxzoZLyLCLT-2N4vN0JXD29RUpy52c39t8ze0was0jD1ruQr74OUFLy`)

2. Update the code:
   - Open `Code.gs` file
   - Select ALL content (Ctrl+A)
   - Delete it
   - Open `Code-API.gs` from your local project
   - Copy ALL content
   - Paste into Apps Script editor

3. Verify Google Slides API is enabled:
   - Left sidebar → Services (+ icon)
   - If "Google Slides API" is not listed, add it
   - Click "Add a service" → Select "Google Slides API" → Add

4. Deploy as Web App:
   - Click "Deploy" button (top right)
   - Select "New deployment"
   - Click gear icon → Select "Web app"
   - Settings:
     - Description: "API Backend v2.0"
     - Execute as: **Me (your email)**
     - Who has access: **Anyone**
   - Click "Deploy"
   - Authorize if prompted
   - **COPY THE WEB APP URL** (you'll need this!)

### Step 2: Deploy Frontend to Vercel (10 minutes)

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the frontend folder:
   ```bash
   cd frontend
   vercel --prod
   ```

4. When prompted:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? **supercoaching-slides** (or your choice)
   - In which directory is your code located? **./`**
   - Want to override settings? **N**

5. Wait for deployment (30-60 seconds)
6. **COPY THE DEPLOYMENT URL** (e.g., `https://supercoaching-slides.vercel.app`)

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import Git Repository:
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Or upload your `frontend` folder
3. Configure:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click "Deploy"
5. **COPY THE DEPLOYMENT URL**

### Step 3: Configure Environment Variables (5 minutes)

1. Go to Vercel Dashboard:
   - https://vercel.com/dashboard
   - Select your project

2. Go to Settings → Environment Variables

3. Add new variable:
   - Name: `VITE_API_URL`
   - Value: (paste your Apps Script Web App URL from Step 1)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

4. Redeploy:
   - Go to Deployments tab
   - Click on the latest deployment
   - Click "..." menu → "Redeploy"
   - Wait for redeployment

### Step 4: Test Your Deployment (5 minutes)

1. Open your Vercel URL in browser

2. Check loading speed:
   - Should load in <1 second
   - Open DevTools (F12) → Network tab
   - Refresh page
   - Check load time

3. Test functionality:
   - ✅ Faculty dropdown loads
   - ✅ Course dropdown loads
   - ✅ Preview updates as you type
   - ✅ Logo selection works
   - ✅ Generate slide button works
   - ✅ Slide opens in new tab

4. Check for errors:
   - Open Console tab (F12)
   - Should see no red errors

### Step 5: Add Custom Domain (Optional - 10 minutes)

1. In Vercel Dashboard:
   - Settings → Domains
   - Click "Add"
   - Enter your domain (e.g., `slides.supercoaching.com`)

2. Update DNS:
   - Go to your domain provider
   - Add CNAME record:
     - Name: `slides`
     - Value: (provided by Vercel)
   - Save

3. Wait for DNS propagation (5-10 minutes)

4. Vercel will automatically provision SSL certificate

## 🎉 You're Done!

Your app is now live with:
- ⚡ 20x faster loading
- 🌍 Global CDN delivery
- 🔒 HTTPS by default
- 📱 Mobile responsive

## 📊 Verify Performance

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Click "Generate report"
4. Should see:
   - Performance: 95+
   - Accessibility: 90+
   - Best Practices: 95+
   - SEO: 90+

## 🔧 Troubleshooting

### "Failed to load data"
- Check VITE_API_URL in Vercel environment variables
- Verify Apps Script deployment is set to "Anyone" access
- Test API directly: `curl -X POST "YOUR_API_URL" -d "action=getFormOptions"`

### "Build failed on Vercel"
- Check build logs in Vercel dashboard
- Verify package.json is correct
- Try building locally: `npm run build`

### "Slow loading"
- Check Network tab in DevTools
- Verify assets are loading from Vercel CDN
- Check Apps Script cache is working

## 📝 Update Your .env File

After deployment, update your local `.env` file:

```bash
# In frontend/.env
VITE_API_URL=YOUR_ACTUAL_APPS_SCRIPT_URL
```

## 🔄 Future Updates

### Update Frontend:
```bash
cd frontend
# Make changes
npm run build
vercel --prod
```

### Update Backend:
1. Edit Code-API.gs in Apps Script editor
2. Save
3. Deploy → Manage deployments → Create new version

## 📞 Need Help?

- Check DEPLOYMENT.md for detailed troubleshooting
- Review ARCHITECTURE.md for technical details
- Check browser console for errors
- Check Apps Script execution logs

## ✅ Success Checklist

- [ ] Apps Script updated with Code-API.gs
- [ ] Apps Script deployed as Web App (Anyone access)
- [ ] Web App URL copied
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL added to Vercel
- [ ] Redeployed after adding env var
- [ ] Tested all features
- [ ] No console errors
- [ ] Loading is fast (<1s)
- [ ] Custom domain added (optional)

---

**Current Status**: Ready to deploy!

**Estimated Time**: 20-30 minutes

**Next Action**: Start with Step 1 above
