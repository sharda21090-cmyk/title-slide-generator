# Fix GitHub Authentication

## The Issue
You're authenticated as `sharda21090-cmyk` but the repository belongs to `shardasingh-ai`.

## Quick Fix: Use Personal Access Token

### Step 1: Create Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Note: "Title Slide Push"
4. Select scope: ✅ `repo`
5. Click "Generate token"
6. **COPY THE TOKEN** (starts with `ghp_`)

### Step 2: Push with Token
Run this command (replace YOUR_TOKEN with the token you copied):

```bash
git push https://YOUR_TOKEN@github.com/shardasingh-ai/title-slide-generator.git main
```

### Step 3: Save Token for Future (Optional)
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/shardasingh-ai/title-slide-generator.git
git push -u origin main
```

## Alternative: Use GitHub Desktop

1. Download: https://desktop.github.com/
2. Sign in with `shardasingh-ai` account
3. File → Add Local Repository
4. Select this folder
5. Click "Publish repository"

## Alternative: Clear Cached Credentials

```bash
# Clear Windows Credential Manager
git credential-manager-core erase https://github.com

# Then try pushing again
git push -u origin main
```

Windows will prompt you to sign in - use the `shardasingh-ai` account.

---

**Quickest**: Use the Personal Access Token method above.
