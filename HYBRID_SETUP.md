# Hybrid Architecture Summary

## What Changed

### Before (Separate Worker)
```
Upload API: https://codelabs.kamilhassan04.workers.dev/upload  ❌ Email visible!
Deploy: Cloudflare Pages only
```

### After (Pages Functions + Hybrid)
```
Upload API: https://codelabs.pages.dev/api/upload  ✅ No email!
Previews: Cloudflare Pages (instant PR previews)
Production: GitHub Pages (stable, https://username.github.io/repo)
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Uploads File                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
              /api/upload (Pages Function)
                         ↓
┌────────────────────────────────────────────────────────────┐
│              Creates GitHub PR                              │
│        codelabs/tutorial.md → New branch                    │
└─────────────┬──────────────────────────────┬───────────────┘
              ↓                              ↓
     ┌────────────────────┐        ┌─────────────────────┐
     │ Cloudflare Pages   │        │   (Waiting for     │
     │  Preview Build     │        │    you to review)  │
     │                    │        └─────────────────────┘
     │  build.sh runs:    │
     │  1. Download claat │              You review preview
     │  2. MD → HTML      │              ✓ Looks good!
     │  3. Build index    │              Merge PR
     │                    │                   ↓
     │  Preview URL:      │        ┌─────────────────────┐
     │  pr-123.pages.dev  │        │  GitHub Actions     │
     └────────────────────┘        │  (on merge to main) │
                                   │                     │
                                   │  Same build:        │
                                   │  1. Download claat  │
                                   │  2. MD → HTML       │
                                   │  3. Build index     │
                                   │  4. Deploy gh-pages │
                                   │                     │
                                   │  Production:        │
                                   │  username.github.io │
                                   └─────────────────────┘
```

## Files Structure

### What You Need to Deploy

```
d:\Projects\codelabs\
├── functions/
│   └── api/
│       └── upload.js           ← Upload API (replaces worker/)
├── .github/
│   └── workflows/
│       └── deploy-catalog.yml  ← Production deploys (GitHub Pages)
├── codelabs/                   ← Source markdown files (user uploads go here)
│   └── *.md
├── index.html                  ← Catalog homepage
├── app.js                      ← Frontend (calls /api/upload)
├── style.css
├── build-index.js              ← Generates codelabs.json
├── build.sh                    ← Build script (downloads claat, exports MD)
└── build.bat                   ← Windows version
```

### Deleted (No Longer Needed)

```
worker/                         ← Replaced by functions/api/upload.js
├── index.js                    ← Migrated to Pages Function
├── wrangler.toml               ← Not needed (using Pages env vars)
├── package.json                ← Not needed
└── README.md                   ← Not needed
```

## Environment Variables

Set these in **Cloudflare Pages** → Settings → Environment variables:

| Variable | Example | Purpose |
|----------|---------|---------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | GitHub API authentication |
| `GITHUB_OWNER` | `your-username` | Your GitHub username |
| `GITHUB_REPO` | `codelabs` | Repository name |
| `GITHUB_DEFAULT_BRANCH` | `main` | Default branch name |
| `CLOUDFLARE_PAGES_PROJECT` | `codelabs` | Pages project name for preview URLs |

## Claat Binary URLs

From: `https://github.com/Bit-Blazer/codelab-tools/releases/latest/download/`

- `claat-linux-amd64` (Cloudflare Pages, GitHub Actions)
- `claat-windows-amd64.exe` (Local testing on Windows)
- `claat-darwin-amd64` (Local testing on macOS)
- `claat-linux-386` (32-bit Linux)
- `claat-windows-386.exe` (32-bit Windows)

## Complete Workflow

1. **User uploads `tutorial.md`** via web UI
2. **Pages Function** (`/api/upload`) receives file
3. **GitHub PR created** with `codelabs/tutorial.md` in new branch
4. **Cloudflare Pages** detects PR
   - Runs `build.sh`
   - Downloads claat
   - Exports MD → `tutorial/` HTML folder
   - Builds `codelabs.json` index
   - Deploys preview: `https://codelab-123-tutorial.pages.dev`
5. **You review preview** (click link from UI or PR)
6. **You merge PR** on GitHub
7. **GitHub Actions** triggers on merge
   - Same build process
   - Deploys to `gh-pages` branch
   - GitHub Pages serves production site
8. **Production live** at `https://username.github.io/repo`

## Setup Checklist

- [ ] Push code to GitHub
- [ ] Connect Cloudflare Pages
  - [ ] Set build command: `bash build.sh`
  - [ ] Add 5 environment variables
  - [ ] Enable PR preview deployments
  - [ ] Disable production deployments (we use GitHub Pages)
- [ ] Enable GitHub Pages
  - [ ] Settings → Pages
  - [ ] Source: Deploy from branch `gh-pages`
- [ ] Test upload feature
  - [ ] Visit Cloudflare preview site
  - [ ] Click "+ Add Codelab"
  - [ ] Upload test .md file
  - [ ] Verify PR created
  - [ ] Verify preview URL works
  - [ ] Merge PR
  - [ ] Verify GitHub Actions runs
  - [ ] Verify production site updates

## Benefits of This Architecture

✅ **No email in URLs** - Uses Pages Functions instead of Workers subdomain
✅ **Preview before merge** - Every PR gets instant Cloudflare preview
✅ **Stable production** - GitHub Pages for production (free, reliable)
✅ **Git-based workflow** - All changes tracked, easy to revert
✅ **No build tools needed locally** - Both platforms handle builds
✅ **Free tier friendly** - Both Cloudflare and GitHub offer generous free tiers
✅ **Fast global CDN** - Cloudflare for previews, GitHub CDN for production

## Next Steps

1. Follow [UPLOAD_SETUP.md](UPLOAD_SETUP.md) for detailed setup
2. Test locally: `bash build.sh` (Linux/Mac) or `build.bat` (Windows)
3. See [FLOW_EXPLAINED.md](FLOW_EXPLAINED.md) for technical deep-dive
4. Read [README.md](README.md) for general usage

## Quick Commands

```bash
# Test build locally
bash build.sh

# Serve locally
python -m http.server 8000

# Check if claat works
wget https://github.com/Bit-Blazer/codelab-tools/releases/latest/download/claat-linux-amd64 -O claat
chmod +x claat
./claat version

# View GitHub Actions logs
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```
