# Documentation Index

Welcome to the Supercoaching Title Slide Generator v2.0 documentation.

## 🚀 Getting Started

Start here if you're new:

1. **[QUICKSTART.md](QUICKSTART.md)** - Deploy in 5 minutes
2. **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** - What we built and why
3. **[BEFORE-AFTER.md](BEFORE-AFTER.md)** - Performance improvements

## 📚 Deployment Guides

Step-by-step instructions:

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md)** - Migration checklist
- **[README.md](README.md)** - Setup and configuration

## 🏗️ Technical Documentation

Deep dives:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[Code-API.gs](Code-API.gs)** - Backend API implementation
- **[frontend/](frontend/)** - Frontend source code

## 📖 Documentation by Role

### For Managers/Decision Makers

1. [BEFORE-AFTER.md](BEFORE-AFTER.md) - See the improvements
2. [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) - Understand the value
3. Cost: $0 (same as before)
4. Time: 30 minutes to deploy

### For Developers

1. [QUICKSTART.md](QUICKSTART.md) - Get running fast
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the system
3. [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
4. [frontend/app.js](frontend/app.js) - Frontend code

### For DevOps/IT

1. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment process
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Infrastructure details
3. [MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md) - Migration steps
4. Monitoring: Vercel dashboard + Apps Script logs

## 📁 File Structure

```
Title-Slide-Generator/
│
├── Documentation/
│   ├── INDEX.md                    ← You are here
│   ├── QUICKSTART.md               ← Start here
│   ├── README.md                   ← Setup guide
│   ├── DEPLOYMENT.md               ← Deployment steps
│   ├── MIGRATION-CHECKLIST.md      ← Migration guide
│   ├── BEFORE-AFTER.md             ← Comparison
│   ├── PROJECT-SUMMARY.md          ← Overview
│   └── ARCHITECTURE.md             ← Technical details
│
├── Frontend/ (Vercel)
│   ├── index.html                  ← UI structure
│   ├── styles.css                  ← Styling
│   ├── app.js                      ← Logic & API client
│   ├── package.json                ← Dependencies
│   ├── vite.config.js              ← Build config
│   ├── vercel.json                 ← Deployment config
│   └── .env.example                ← Environment template
│
├── Backend/ (Apps Script)
│   ├── Code-API.gs                 ← NEW: API version
│   ├── Code.gs                     ← OLD: Original version
│   ├── index.html                  ← OLD: Original HTML
│   └── appsscript.json             ← Apps Script config
│
└── Config/
    ├── .gitignore                  ← Git ignore rules
    ├── package.json                ← Root package
    └── .clasp.json                 ← Apps Script config
```

## 🎯 Common Tasks

### Deploy for the First Time
→ [QUICKSTART.md](QUICKSTART.md)

### Migrate from Old Version
→ [MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md)

### Understand the Architecture
→ [ARCHITECTURE.md](ARCHITECTURE.md)

### Troubleshoot Issues
→ [DEPLOYMENT.md](DEPLOYMENT.md) (Troubleshooting section)

### Update Frontend Code
```bash
cd frontend
# Make changes
npm run dev  # Test locally
git commit -m "Update: description"
vercel --prod  # Deploy
```

### Update Backend Code
```bash
# Edit Code-API.gs
clasp push  # Upload to Apps Script
# Redeploy in Apps Script editor
```

### Clear Data Cache
```javascript
// In Apps Script editor
clearFormOptionsCache()
```

### Add Custom Domain
→ [DEPLOYMENT.md](DEPLOYMENT.md) (Custom Domain section)

## 🔍 Quick Reference

### URLs

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://script.google.com/macros/s/YOUR_ID/exec`
- **Sheets**: `https://docs.google.com/spreadsheets/d/YOUR_ID`
- **Template**: `https://docs.google.com/presentation/d/YOUR_ID`

### Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

### Key Files to Edit

- **Frontend UI**: `frontend/index.html`
- **Frontend Styles**: `frontend/styles.css`
- **Frontend Logic**: `frontend/app.js`
- **Backend API**: `Code-API.gs`
- **Config**: `appsscript.json`

## 📊 Performance Metrics

| Metric | Target | How to Check |
|--------|--------|--------------|
| Load Time | <200ms | Chrome DevTools Network |
| Lighthouse | 95+ | Chrome DevTools Lighthouse |
| API Response | <3s | Network tab |
| Cache Hit | 99%+ | Apps Script logs |

## 🆘 Support

### Getting Help

1. Check relevant documentation above
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting
3. Check browser console (F12)
4. Check Apps Script execution logs
5. Check Vercel deployment logs

### Common Issues

**"Failed to load data"**
→ Check VITE_API_URL in Vercel environment variables

**"Build failed"**
→ Run `npm run build` locally to see errors

**"Slow loading"**
→ Check Apps Script cache, verify CDN is working

**"CORS error"**
→ Verify Apps Script deployment is set to "Anyone"

## 🎓 Learning Path

### Beginner
1. Read [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Deploy and test

### Intermediate
1. Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. Understand [frontend/app.js](frontend/app.js)
3. Customize styles in [frontend/styles.css](frontend/styles.css)

### Advanced
1. Study [Code-API.gs](Code-API.gs)
2. Optimize caching strategy
3. Add new features
4. Consider Supabase migration

## 🚀 Next Steps

After successful deployment:

1. ✅ Test all features
2. ✅ Share new URL with team
3. ✅ Set up custom domain (optional)
4. ✅ Monitor performance
5. ✅ Consider Supabase for data (optional)

## 📝 Version History

- **v2.0** - Hybrid architecture (Vercel + Apps Script)
- **v1.0** - Original Apps Script monolith

## 📄 License

Private - Supercoaching Internal Tool

---

**Ready to start?** → [QUICKSTART.md](QUICKSTART.md)
