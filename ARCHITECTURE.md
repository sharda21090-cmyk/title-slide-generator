# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CDN (Global)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend Assets (Cached 1 year)                     │   │
│  │  • index.html                                        │   │
│  │  • styles.css (minified)                             │   │
│  │  • app.js (minified)                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls (POST)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  GOOGLE APPS SCRIPT API                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  doPost() Handler                                    │   │
│  │  ├─ getFormOptions()    → Cached 6h                 │   │
│  │  ├─ getAvailableLogos() → Static                    │   │
│  │  ├─ getLogoPreview()    → Drive API                 │   │
│  │  └─ generateTitleSlide() → Slides API               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐  ┌──────────────────┐
        │  GOOGLE SHEETS    │  │  GOOGLE DRIVE    │
        │  • Faculty Data   │  │  • Templates     │
        │  • Course Data    │  │  • Logos         │
        └───────────────────┘  │  • Generated     │
                               │    Slides        │
                               └──────────────────┘
```

## Request Flow

### 1. Initial Page Load

```
User → Vercel CDN → Browser
  ↓
  Loads HTML (100ms)
  ↓
  Loads CSS (cached, 10ms)
  ↓
  Loads JS (cached, 10ms)
  ↓
  Total: ~120ms ✅
```

### 2. Data Fetch (First Time)

```
Browser → Apps Script API
  ↓
  getFormOptions()
  ↓
  Sheets API (2-3s)
  ↓
  Cache for 6h
  ↓
  Return JSON
  ↓
  Browser renders dropdowns
```

### 3. Data Fetch (Cached)

```
Browser → Apps Script API
  ↓
  getFormOptions()
  ↓
  Read from cache (50ms) ✅
  ↓
  Return JSON
  ↓
  Browser renders dropdowns
```

### 4. Slide Generation

```
Browser → Apps Script API
  ↓
  generateTitleSlide(formData)
  ↓
  Copy template (1s)
  ↓
  Update elements (2s)
  ↓
  Insert images (2s)
  ↓
  Save & export (1s)
  ↓
  Return URLs
  ↓
  Browser opens slide
```

## Component Architecture

### Frontend (Vercel)

```
frontend/
│
├── index.html              # Structure
│   ├── Form inputs
│   ├── Preview panel
│   └── Status messages
│
├── styles.css              # Presentation
│   ├── Layout (Grid)
│   ├── Components
│   └── Responsive design
│
├── app.js                  # Logic
│   ├── API Client
│   │   ├── call()
│   │   ├── getFormOptions()
│   │   ├── getAvailableLogos()
│   │   ├── getLogoPreview()
│   │   └── generateTitleSlide()
│   │
│   ├── UI Controllers
│   │   ├── buildDropdown()
│   │   ├── updatePreview()
│   │   └── showStatus()
│   │
│   └── Event Handlers
│       ├── Form submit
│       ├── Input changes
│       └── Logo selection
│
└── vite.config.js          # Build
    ├── Minification
    ├── Code splitting
    └── Asset optimization
```

### Backend (Apps Script)

```
Code-API.gs
│
├── Configuration
│   ├── SPREADSHEET_ID
│   ├── TEMPLATE_PRESENTATION_ID
│   ├── Element IDs (EL)
│   └── BUILT_IN_LOGOS
│
├── API Endpoints
│   ├── doGet()  → Health check
│   └── doPost() → Route actions
│
├── Data Layer
│   ├── getFormOptions()
│   │   ├── Fetch from Sheets
│   │   ├── Parse & format
│   │   └── Cache 6h
│   │
│   └── clearFormOptionsCache()
│
├── Asset Layer
│   ├── getAvailableLogos()
│   └── getLogoPreview()
│       └── Drive API
│
├── Generation Layer
│   └── generateTitleSlide()
│       ├── Copy template
│       ├── Update elements
│       ├── Insert images
│       ├── Apply autofit
│       └── Export PNG
│
└── Helpers
    ├── _setText()
    ├── _swapImage()
    ├── _fetchImageBlob()
    ├── _findSlide()
    ├── _getOrCreateFolder()
    └── _setTextAutoFit()
```

## Data Flow

### Faculty Selection

```
1. User types in search box
   ↓
2. Filter faculty list (client-side)
   ↓
3. User selects faculty
   ↓
4. Populate experience field
   ↓
5. Load faculty photo
   ↓
6. Update preview
```

### Slide Generation

```
1. User fills form
   ↓
2. Client validates inputs
   ↓
3. POST to Apps Script API
   ↓
4. Server validates data
   ↓
5. Copy template presentation
   ↓
6. Update text elements
   ↓
7. Swap logo (if selected)
   ↓
8. Insert faculty photo
   ↓
9. Apply text autofit
   ↓
10. Save presentation
    ↓
11. Generate PNG export URL
    ↓
12. Return URLs to client
    ↓
13. Client opens slide in new tab
```

## Caching Strategy

### Frontend (Vercel CDN)

```
Static Assets:
├── HTML: No cache (always fresh)
├── CSS: 1 year (immutable)
├── JS: 1 year (immutable)
└── Images: 1 year (immutable)

Cache-Control Headers:
├── /: no-cache
└── /assets/*: max-age=31536000, immutable
```

### Backend (Apps Script)

```
CacheService:
├── formOptions_v3: 6 hours
└── Manual clear: clearFormOptionsCache()

Why 6 hours?
├── Faculty data changes infrequently
├── Course list is relatively stable
└── Balance between freshness and speed
```

## Security Model

### Frontend

```
Vercel Security Headers:
├── X-Content-Type-Options: nosniff
├── X-Frame-Options: DENY
├── X-XSS-Protection: 1; mode=block
└── HTTPS: Enforced
```

### Backend

```
Apps Script:
├── Execute as: User deploying
├── Access: Anyone (for API)
├── OAuth Scopes:
│   ├── presentations (Slides API)
│   ├── drive (File access)
│   ├── script.external_request (UrlFetch)
│   └── spreadsheets.readonly (Sheets)
└── Input validation in doPost()
```

## Error Handling

### Frontend

```javascript
try {
  const result = await api.generateTitleSlide(formData);
  if (result.success) {
    showStatus('success', message);
  } else {
    showStatus('error', result.error);
  }
} catch (error) {
  showStatus('error', 'Network error');
}
```

### Backend

```javascript
function doPost(e) {
  try {
    // Process request
    return successResponse(result);
  } catch (error) {
    return errorResponse(error.message);
  }
}
```

## Performance Optimizations

### Frontend

1. **Asset Optimization**
   - Minified CSS/JS
   - Gzip compression
   - CDN delivery

2. **Code Splitting**
   - Separate vendor bundles
   - Lazy load non-critical code

3. **Caching**
   - Long-term asset caching
   - Service worker (future)

### Backend

1. **Data Caching**
   - 6-hour cache for sheet data
   - Reduces API calls by 99%

2. **Batch Operations**
   - Single Sheets API call
   - Batch update for autofit

3. **Lazy Loading**
   - Logo preview on-demand
   - Photo fetch only when needed

## Monitoring & Debugging

### Frontend (Browser DevTools)

```
Network Tab:
├── Check load times
├── Verify caching
└── Debug API calls

Console:
├── Error messages
├── API responses
└── State changes

Performance:
├── Lighthouse score
├── Core Web Vitals
└── Load timeline
```

### Backend (Apps Script)

```
Executions:
├── View all API calls
├── Execution time
├── Error logs
└── Quota usage

Logs:
├── Logger.log() output
├── Error stack traces
└── Debug information
```

## Scalability

### Current Limits

```
Vercel Free Tier:
├── Bandwidth: 100 GB/month
├── Requests: Unlimited
├── Build time: 6000 min/month
└── Concurrent builds: 1

Apps Script:
├── URL Fetch: 20,000/day
├── Script runtime: 6 min/execution
├── Triggers: 90 min/day
└── Simultaneous executions: 30
```

### Scaling Strategy

```
Phase 1 (Current):
└── Vercel + Apps Script
    ├── Handles 1000s users/day
    └── Cost: $0

Phase 2 (If needed):
└── Vercel + Apps Script + Supabase
    ├── Faster data queries
    ├── Handles 10,000s users/day
    └── Cost: $0 (free tiers)

Phase 3 (If needed):
└── Vercel + Serverless Functions + Supabase
    ├── Full control
    ├── Handles 100,000s users/day
    └── Cost: ~$20-50/month
```

## Deployment Pipeline

```
Development:
├── Edit code locally
├── npm run dev (hot reload)
└── Test in browser

Staging:
├── git commit
├── git push
├── Vercel auto-deploys preview
└── Test preview URL

Production:
├── vercel --prod
├── Vercel deploys to production
├── DNS updates (if custom domain)
└── Live in 30 seconds
```

## Rollback Strategy

```
Frontend:
├── Vercel dashboard
├── Select previous deployment
└── Promote to production (instant)

Backend:
├── Apps Script editor
├── Deploy → Manage deployments
└── Select previous version
```

## Future Architecture (Optional)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Vercel    │ ← React/Vue (optional)
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐  ┌──────────────┐
│  Supabase   │  │ Apps Script  │
│  (Data)     │  │ (Slides Gen) │
└─────────────┘  └──────────────┘
```

This architecture is designed for:
- Maximum performance
- Minimal cost
- Easy maintenance
- Future scalability
