# GitHub Authentication Setup

## The Problem
The repository `https://github.com/shardasingh-ai/title-slide-generator.git` either:
1. Doesn't exist yet, OR
2. Exists but you need authentication

## Solution 1: Create the Repository (If it doesn't exist)

1. Go to: https://github.com/new
2. Repository name: `title-slide-generator`
3. Owner: `shardasingh-ai`
4. Visibility: Private (recommended)
5. **DO NOT** check any boxes (no README, .gitignore, or license)
6. Click "Create repository"
7. Come back and run: `git push -u origin main`

## Solution 2: Authenticate (If repository exists)

### Method A: Personal Access Token (Recommended)

1. **Create Token**:
   - Visit: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Note: "Title Slide Generator Push"
   - Expiration: 90 days (or your choice)
   - Select scopes: ✅ `repo` (all repo permissions)
   - Click "Generate token"
   - **COPY THE TOKEN** (looks like: `ghp_xxxxxxxxxxxx`)

2. **Configure Git to use token**:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/shardasingh-ai/title-slide-generator.git
   ```

3. **Push**:
   ```bash
   git push -u origin main
   ```

### Method B: GitHub Desktop (Easiest for Windows)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. File → Add Local Repository → Select this folder
4. Click "Publish repository"

### Method C: SSH Key (Most Secure)

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "sharda.21090@gmail.com"
   ```
   Press Enter for all prompts (use default location)

2. **Copy public key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy the entire output

3. **Add to GitHub**:
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "Title Slide Generator"
   - Paste the key
   - Click "Add SSH key"

4. **Change remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:shardasingh-ai/title-slide-generator.git
   ```

5. **Push**:
   ```bash
   git push -u origin main
   ```

## Quick Test

After setting up authentication, test with:
```bash
git ls-remote origin
```

If this works, you're authenticated! Then push:
```bash
git push -u origin main
```

## Still Having Issues?

### Check if repository exists:
Visit: https://github.com/shardasingh-ai/title-slide-generator

- If you see "404" → Repository doesn't exist, create it (Solution 1)
- If you see the repo → You need authentication (Solution 2)
- If you see "You don't have access" → Ask the owner to add you as collaborator

### Verify your GitHub username:
Your Git is configured as:
- Name: sps0210
- Email: sharda.21090@gmail.com

Make sure this matches your GitHub account.

---

**Recommended**: Use Method A (Personal Access Token) - it's the quickest for Windows.
