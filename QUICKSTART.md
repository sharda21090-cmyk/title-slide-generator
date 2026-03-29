# Quick Start Guide

Get your new fast frontend running in 5 minutes.

## Prerequisites

- Node.js installed (v18+)
- Google Apps Script project
- Vercel account (free)

## Step 1: Update Apps Script (2 min)

1. Open your Apps Script project at https://script.google.com
2. Replace `Code.gs` content with `Code-API.gs`
3. Deploy → Manage deployments → Edit
4. Change access to "Anyone"
5. Copy the Web App URL

## Step 2: Deploy Frontend (3 min)

```bash
# Install dependencies
cd frontend
npm install

# Set your API URL
echo "VITE_API_URL=YOUR_APPS_SCRIPT_URL" > .env

# Deploy to Vercel
npx vercel --prod
```

When prompted:
- Project name: `supercoaching-slides`
- Directory: `./`
- Override settings: No

## Step 3: Configure Vercel

1. Go to https://vercel.com/dashboard
2. Open your project
3. Settings → Environment Variables
4. Add:
   - Name: `VITE_API_URL`
   - Value: Your Apps Script URL
   - All environments
5. Deployments → Redeploy

## Done! 🎉

Your app is live at the Vercel URL.

## Test It

1. Open your Vercel URL
2. Should load instantly (<1s)
3. Select a faculty
4. Enter a title
5. Generate slide
6. Verify it opens

## Add Custom Domain (Optional)

```bash
# In Vercel dashboard
Settings → Domains → Add Domain
# Enter: slides.supercoaching.com
# Follow DNS instructions
```

## Troubleshooting

**"Failed to load data"**
```bash
# Test API directly
curl -X POST "YOUR_API_URL" -d "action=getFormOptions"
```

Should return JSON with faculties and courses.

**Build fails**
```bash
# Test locally first
cd frontend
npm run build
```

**Slow loading**
- Check VITE_API_URL is set in Vercel
- Verify Apps Script deployment is "Anyone" access

## What's Next?

- Share the new URL with your team
- Set up custom domain
- Monitor performance in Vercel dashboard
- Consider migrating data to Supabase for even faster loads

## Need Help?

- Check DEPLOYMENT.md for detailed steps
- Review MIGRATION-CHECKLIST.md
- See BEFORE-AFTER.md for architecture details
