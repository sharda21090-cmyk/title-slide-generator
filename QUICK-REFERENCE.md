# Quick Reference Card

## 🎯 Your Project URLs

```
Apps Script Project:
https://script.google.com/home/projects/1zpxzoZLyLCLT-2N4vN0JXD29RUpy52c39t8ze0was0jD1ruQr74OUFLy

Spreadsheet (Data Source):
https://docs.google.com/spreadsheets/d/1CpgtjeKNxhQmqKSkqnwe-IHZmjI1ENypBAyClxjbkUs

Template Presentation:
https://docs.google.com/presentation/d/1v2hScTPtBkXVJq_swTFcwnIn_BdAr-DofBOOO7ozpfk

After Deployment:
- Apps Script API: [Your Web App URL]
- Vercel Frontend: [Your Vercel URL]
- Custom Domain: [Your domain if configured]
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `Code-API.gs` | Backend API (copy to Apps Script) |
| `frontend/index.html` | Frontend UI |
| `frontend/app.js` | Frontend logic |
| `frontend/styles.css` | Styling |
| `frontend/.env` | API URL configuration |
| `DEPLOY-NOW.md` | Deployment instructions |

## 🚀 Quick Commands

```bash
# Install dependencies
cd frontend
npm install

# Test build
npm run build

# Run locally
npm run dev

# Deploy to Vercel
vercel --prod

# View logs
vercel logs
```

## 🔧 Configuration

### Apps Script Settings
```javascript
SPREADSHEET_ID = '1CpgtjeKNxhQmqKSkqnwe-IHZmjI1ENypBAyClxjbkUs'
FACULTY_SHEET = 'FacultyData'
COURSE_SHEET = 'AllCourse'
TEMPLATE_PRESENTATION_ID = '1v2hScTPtBkXVJq_swTFcwnIn_BdAr-DofBOOO7ozpfk'
```

### Environment Variables
```bash
# frontend/.env
VITE_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Vercel Environment Variables
```
Name: VITE_API_URL
Value: [Your Apps Script Web App URL]
Environments: Production, Preview, Development
```

## 🔍 Testing Checklist

- [ ] Frontend loads in <1 second
- [ ] Faculty dropdown populates
- [ ] Course dropdown populates
- [ ] Preview updates in real-time
- [ ] Logo selection works
- [ ] Generate slide creates presentation
- [ ] PNG export link works
- [ ] No console errors
- [ ] Mobile responsive

## 🐛 Debug Commands

```bash
# Test API directly
curl -X POST "YOUR_API_URL" -d "action=getFormOptions"

# Check build locally
cd frontend
npm run build

# View Vercel logs
vercel logs --follow

# Clear Apps Script cache
# Run in Apps Script editor:
clearFormOptionsCache()
```

## 📊 Performance Targets

| Metric | Target | How to Check |
|--------|--------|--------------|
| Load Time | <200ms | DevTools Network tab |
| Lighthouse | 95+ | DevTools Lighthouse |
| API Response | <3s | Network tab |
| Cache Hit Rate | 99%+ | Apps Script logs |

## 🔄 Update Workflow

### Frontend Changes
```bash
cd frontend
# Edit files
npm run build  # Test
git add .
git commit -m "Update: description"
vercel --prod  # Deploy
```

### Backend Changes
```
1. Edit Code-API.gs in Apps Script editor
2. Save (Ctrl+S)
3. Deploy → Manage deployments → New version
```

### Data Changes
```
1. Update Google Sheet
2. Run clearFormOptionsCache() in Apps Script
3. Data refreshes in 6 hours or immediately after cache clear
```

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to load data" | Check VITE_API_URL in Vercel |
| Build fails | Run `npm run build` locally |
| Slow loading | Verify CDN is working |
| CORS error | Check Apps Script access = "Anyone" |
| Cache not updating | Run `clearFormOptionsCache()` |

## 📞 Support Resources

| Resource | Link |
|----------|------|
| Deployment Guide | DEPLOY-NOW.md |
| Quick Start | QUICKSTART.md |
| Full Documentation | INDEX.md |
| Architecture | ARCHITECTURE.md |
| Troubleshooting | DEPLOYMENT.md |

## 🎯 Deployment Status

```
✅ Code ready
✅ Build tested
✅ Dependencies installed
⏳ Awaiting Apps Script deployment
⏳ Awaiting Vercel deployment
⏳ Awaiting environment configuration
```

## 📝 Next Steps

1. Open DEPLOY-NOW.md
2. Follow Step 1: Update Apps Script
3. Follow Step 2: Deploy to Vercel
4. Follow Step 3: Configure environment
5. Follow Step 4: Test deployment

---

**Ready to deploy?** → Open [DEPLOY-NOW.md](DEPLOY-NOW.md)
