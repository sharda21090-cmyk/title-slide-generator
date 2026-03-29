# Deployment Guide

## Quick Start (5 minutes)

### Step 1: Deploy Backend (2 min)

1. Open https://script.google.com
2. Open your existing project or create new
3. Copy all content from `Code-API.gs`
4. Paste into `Code.gs` (replace existing)
5. Click Deploy → Manage deployments → Edit (pencil icon)
6. Change "Who has access" to **Anyone**
7. Click Deploy
8. Copy the Web App URL

### Step 2: Deploy Frontend (3 min)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=YOUR_APPS_SCRIPT_URL_HERE" > .env

# Deploy to Vercel
npx vercel --prod

# When prompted:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? supercoaching-slides
# - Directory? ./
# - Override settings? N
```

### Step 3: Configure Vercel Environment

1. Visit https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variable:
   - Name: `VITE_API_URL`
   - Value: Your Apps Script URL
   - Environment: Production, Preview, Development
5. Save
6. Deployments → Latest → Redeploy

Done! Your app is live at `https://your-project.vercel.app`

## Custom Domain Setup

### Option 1: Vercel Domain

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `slides.supercoaching.com`
3. Follow DNS instructions (add CNAME record)
4. Wait 5-10 minutes for propagation

### Option 2: Cloudflare (Recommended)

1. Add domain to Cloudflare
2. In Vercel: Settings → Domains → Add `slides.supercoaching.com`
3. Copy the CNAME target from Vercel
4. In Cloudflare DNS:
   - Type: CNAME
   - Name: slides
   - Target: (paste from Vercel)
   - Proxy: ON (orange cloud)
5. SSL/TLS → Full (strict)

Benefits:
- Free SSL
- DDoS protection
- Better caching
- Analytics

## Performance Optimization

### Enable Vercel Analytics (Optional)

```bash
cd frontend
npm install @vercel/analytics
```

Add to `app.js`:
```javascript
import { inject } from '@vercel/analytics';
inject();
```

Redeploy:
```bash
npm run build
vercel --prod
```

### Enable Vercel Speed Insights (Optional)

```bash
npm install @vercel/speed-insights
```

Add to `app.js`:
```javascript
import { injectSpeedInsights } from '@vercel/speed-insights';
injectSpeedInsights();
```

## Monitoring

### Apps Script Logs

1. Open Apps Script editor
2. Left sidebar → Executions
3. View API call logs and errors

### Vercel Logs

1. Vercel Dashboard → Your Project
2. Deployments → Latest → View Function Logs
3. Monitor build and runtime logs

## Rollback

### Rollback Frontend

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

Or via dashboard:
1. Deployments → Select previous deployment
2. Click "Promote to Production"

### Rollback Backend

1. Apps Script editor
2. Deploy → Manage deployments
3. Select previous version
4. Click "Deploy"

## Troubleshooting

### Build Fails on Vercel

Check:
- `package.json` has correct dependencies
- `vite.config.js` exists
- No syntax errors in JS files

Fix:
```bash
# Test build locally
cd frontend
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build"
git push
```

### API Not Working

1. Check Apps Script deployment:
   - Must be "Anyone" access
   - Must be latest version
2. Check VITE_API_URL in Vercel
3. Test API directly:
   ```bash
   curl -X POST "YOUR_API_URL" \
     -d "action=getFormOptions"
   ```

### Slow Performance

1. Check Vercel region (should be closest to users)
2. Enable caching headers (already in vercel.json)
3. Consider Cloudflare for additional caching
4. Move data from Sheets to Supabase

## Security

### Apps Script

- Never expose sensitive data in responses
- Validate all inputs in `doPost()`
- Keep script ID private (use env vars)

### Vercel

- Never commit `.env` files
- Use Vercel environment variables
- Enable security headers (already in vercel.json)

## Cost

- **Vercel**: Free tier (100GB bandwidth, unlimited requests)
- **Apps Script**: Free (quotas: 20,000 URL fetches/day)
- **Google Sheets**: Free
- **Custom Domain**: ~$10-15/year

Total: ~$10-15/year (just domain cost)

## Support

Issues? Check:
1. Apps Script execution logs
2. Vercel deployment logs
3. Browser console (F12)
4. Network tab for API calls

Still stuck? Review README.md for architecture details.
