# Migration Checklist

## Pre-Migration
- [ ] Current Apps Script URL noted down
- [ ] Spreadsheet ID confirmed in Code.gs
- [ ] Template Presentation ID confirmed
- [ ] Logo file IDs confirmed
- [ ] Backup of current Code.gs and index.html

## Backend Migration (Apps Script)
- [ ] Open Apps Script editor
- [ ] Copy content from `Code-API.gs`
- [ ] Paste into Code.gs (or create new file)
- [ ] Verify Google Slides API is enabled (Services → Google Slides API)
- [ ] Deploy → New deployment → Web app
- [ ] Set "Execute as: Me"
- [ ] Set "Who has access: Anyone"
- [ ] Copy Web App URL
- [ ] Test API: `curl -X POST "YOUR_URL" -d "action=getFormOptions"`

## Frontend Setup (Local)
- [ ] Navigate to `frontend/` folder
- [ ] Run `npm install`
- [ ] Create `.env` file from `.env.example`
- [ ] Paste Apps Script URL into `.env`
- [ ] Test locally: `npm run dev`
- [ ] Verify form loads with data
- [ ] Test slide generation
- [ ] Test logo preview

## Vercel Deployment
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run `vercel` in frontend folder
- [ ] Follow prompts to create project
- [ ] Note deployment URL
- [ ] Go to Vercel dashboard
- [ ] Settings → Environment Variables
- [ ] Add `VITE_API_URL` with Apps Script URL
- [ ] Redeploy: `vercel --prod`
- [ ] Test production URL

## Custom Domain (Optional)
- [ ] Vercel → Settings → Domains
- [ ] Add your domain (e.g., slides.supercoaching.com)
- [ ] Update DNS records as instructed
- [ ] Wait for SSL certificate (5-10 min)
- [ ] Test custom domain

## Testing
- [ ] Load frontend - should be fast (<1s)
- [ ] Faculty dropdown loads
- [ ] Course dropdown loads
- [ ] Logo selection works
- [ ] Preview updates in real-time
- [ ] Generate slide works
- [ ] Slide opens in new tab
- [ ] PNG export link works
- [ ] Test on mobile device

## Performance Verification
- [ ] Frontend loads in <100ms (check Network tab)
- [ ] Static assets cached (check Response headers)
- [ ] API calls complete in <2s
- [ ] No console errors

## Cleanup (After Successful Migration)
- [ ] Update internal documentation with new URL
- [ ] Share new URL with team
- [ ] Monitor for 1 week
- [ ] Archive old deployment (keep as backup)

## Rollback Plan (If Issues)
- [ ] Keep old Apps Script deployment active
- [ ] Keep old HTML version accessible
- [ ] Can switch back by changing deployment version

## Success Criteria
✅ Frontend loads 10x faster  
✅ Clean URL (custom domain)  
✅ All features working  
✅ No errors in console  
✅ Mobile responsive  
✅ Team can access and use  

## Timeline
- Backend migration: 5 minutes
- Frontend setup: 10 minutes
- Vercel deployment: 5 minutes
- Testing: 10 minutes
- **Total: ~30 minutes**

## Support
If stuck, check:
1. DEPLOYMENT.md for detailed steps
2. README.md for architecture overview
3. Apps Script execution logs
4. Vercel deployment logs
5. Browser console (F12)
