# Gemini Auto-Translation Setup

## Overview
The system can automatically translate English titles to Hindi using Google's Gemini API.

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated API key

### 2. Configure in Apps Script
1. Open `Code-API.gs` in your Apps Script editor
2. Find the line: `var GEMINI_API_KEY = '';`
3. Add your API key: `var GEMINI_API_KEY = 'YOUR_API_KEY_HERE';`
4. Save and deploy

### 3. How It Works
- When generating a slide, if the Hindi title field is empty, the system will automatically translate the English title to Hindi
- Translation preserves bullet points and formatting
- If translation fails or API key is not configured, the Hindi field will remain empty

## Benefits
- Saves time by auto-translating titles
- Maintains consistency in translations
- Preserves formatting and structure
- Users can still manually edit or override the translation

## Note
- Translation only happens if Hindi title is empty
- Manual Hindi input always takes precedence
- API calls are made only when needed
