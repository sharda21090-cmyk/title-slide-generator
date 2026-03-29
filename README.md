# Supercoaching Title Slide Generator v2.0

Fast, modern web app for generating branded title slides for Supercoaching courses.

## Architecture

**Frontend (Vercel)** - Fast CDN-served UI
- Vite + Vanilla JS
- Loads in <100ms globally
- Clean custom domain support

**Backend (Google Apps Script)** - Slide generation API
- Handles Google Slides/Drive operations
- Fetches data from Google Sheets
- Caches for 6 hours

## Performance Improvements

✅ **10x faster frontend load** - Vercel CDN vs Apps Script HTML  
✅ **Clean URLs** - Custom domain instead of script.google.com  
✅ **Better caching** - Static assets cached at edge  
✅ **Modern build** - Minified, optimized assets

## Setup Instructions

### 1. Deploy Apps Script Backend

1. Open [Google Apps Script](https://script.google.com)
2. Create new project or open existing
3. Replace `Code.gs` with contents of `Code-API.gs`
4. Enable Google Slides API:
   - Left sidebar → Services → + Add a service
   - Select "Google Slides API" → Add
5. Deploy as Web App:
   - Click Deploy → New deployment
   - Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy
6. Copy the Web App URL (looks like `https://script.google.com/macros/s/ABC.../exec`)

### 2. Deploy Frontend to Vercel

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with your Apps Script URL
cp .env.example .env
# Edit .env and paste your Web App URL

# Test locally
npm run dev

# Deploy to Vercel
npx vercel

# Follow prompts:
# - Link to existing project or create new
# - Set root directory to "frontend"
# - Override build command: npm run build
# - Override output directory: dist
```

### 3. Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `VITE_API_URL` = your Apps Script Web App URL
4. Redeploy

### 4. Update Apps Script Config (Optional)

In `Code-API.gs`, update:
- `SPREADSHEET_ID` - Your Google Sheet ID
- `TEMPLATE_PRESENTATION_ID` - Your template slide ID
- `BUILT_IN_LOGOS` - Your logo file IDs

## Local Development

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
.
├── frontend/              # Vercel frontend
│   ├── index.html        # Main HTML
│   ├── styles.css        # All styles
│   ├── app.js            # App logic + API client
│   ├── package.json      # Dependencies
│   ├── vite.config.js    # Build config
│   └── vercel.json       # Vercel config
│
├── Code-API.gs           # Apps Script backend (API version)
├── Code.gs               # Original Apps Script (legacy)
├── index.html            # Original HTML (legacy)
└── README.md             # This file
```

## Migration from Legacy

The original Apps Script web app (`Code.gs` + `index.html`) still works. The new version:
- Separates frontend (Vercel) from backend (Apps Script)
- Uses HTTP API instead of `google.script.run`
- Provides better performance and custom domain support

## Troubleshooting

**"Failed to load data"**
- Check Apps Script deployment is set to "Anyone" access
- Verify VITE_API_URL in Vercel environment variables
- Check Apps Script execution logs

**Slow data loading**
- Data is cached for 6 hours in Apps Script
- Run `clearFormOptionsCache()` in Apps Script editor to refresh
- Consider moving to Supabase for faster queries (see below)

**CORS errors**
- Apps Script automatically handles CORS for POST requests
- Ensure deployment is set to "Anyone" access

## Future Enhancements

### Move to Supabase for Data (Optional)

For even faster data loading:

1. Create free Supabase project
2. Import faculty/course data from Sheets
3. Update `app.js` to fetch from Supabase instead
4. Keep Apps Script only for slide generation

Benefits:
- Sub-100ms data queries
- Real-time updates
- Better scalability

## License

Private - Supercoaching Internal Tool
