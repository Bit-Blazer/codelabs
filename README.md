# Codelabs Catalog

A modern, lightweight static catalog for browsing codelabs.

## Features

- 🎨 **Modern Design** - Clean, responsive card-based layout
- 🔍 **Instant Search** - Real-time search across titles, summaries, categories, and tags
- 🏷️ **Filter & Sort** - Filter by category, sort by title/date/duration
- 🌓 **Dark Mode** - Automatic theme switching with persistence
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Zero Dependencies** - Pure HTML/CSS/JS, no frameworks needed
- 🚀 **Static** - No server required, works on file:// protocol

## Quick Start

### Setup Workflow

1. **Download/Clone** this catalog folder
2. **Navigate** into the catalog directory:

   ```bash
   cd catalog
   ```

3. **Create** a `codelabs` folder for source markdown files:

   ```bash
   mkdir codelabs
   ```

4. **Write** your codelab markdown files in the `codelabs` folder
5. **Export** them to the catalog root:

   ```bash
   cd codelabs
   claat export -o .. your-tutorial.md
   ```

6. **Build** the index:

   ```bash
   cd ..
   node build-index.js . codelabs.json
   ```

7. **Serve** the catalog:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Or just open index.html in your browser
   ```

## File Structure

```
catalog/
├── index.html         # Main catalog page
├── style.css          # Styles (light/dark theme)
├── app.js             # Search/filter/sort logic
├── build-index.js     # Index generator script
├── codelabs.json      # Generated index file
├── README.md          # This file
├── tutorial-1/        # Exported codelab (at root for clean URLs)
│   ├── index.html
│   └── codelab.json
├── tutorial-2/        # Exported codelab (at root for clean URLs)
│   ├── index.html
│   └── codelab.json
└── codelabs/          # Source markdown files
    ├── tutorial-1.md
    └── tutorial-2.md
```

**URL Structure:**

- Catalog homepage: `https://yoursite.com/`
- Codelab pages: `https://yoursite.com/tutorial-1/`
- Source files: `https://yoursite.com/codelabs/tutorial-1.md`

## Build Index Options

```bash
# Scan current directory for exported codelabs, write to codelabs.json
node build-index.js . codelabs.json

# Scan specific directory (legacy structure)
node build-index.js ./codelabs codelabs.json

# Custom output file
node build-index.js . output.json
```

## Integration with CLAAT

### Automatic Index Updates

Add to your build script:

```bash
#!/bin/bash
# Export all markdown files from codelabs/ to root
cd codelabs
for file in *.md; do
  claat export -o .. "$file"
done

# Rebuild catalog index
cd ..
node build-index.js . codelabs.json
```

## Upload Feature (Hybrid Workflow)

The catalog includes a "+ Add Codelab" button that lets users upload markdown files, which automatically:
1. Creates a new branch in your GitHub repository
2. Commits the file to `codelabs/<filename>.md`
3. Opens a pull request for review
4. **Cloudflare Pages builds preview** (for review)
5. After merge: **GitHub Actions deploys to production** (GitHub Pages)

**Architecture:**
- **Previews:** Cloudflare Pages (instant PR previews)
- **Production:** GitHub Pages (stable, version-controlled)
- **Upload API:** Cloudflare Pages Functions (`/api/upload`)

### Setup Steps

#### 1. Create GitHub Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 2. Set Up Cloudflare Pages (for previews)

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure build settings:
   - **Build command**: `bash build.sh`
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (root)
5. Set **Environment variables** (in Settings → Environment variables):
   ```
   GITHUB_TOKEN=<your-github-token>
   GITHUB_OWNER=<your-username>
   GITHUB_REPO=<your-repo-name>
   GITHUB_DEFAULT_BRANCH=main
   CLOUDFLARE_PAGES_PROJECT=<your-pages-project-name>
   ```
6. Enable **Preview deployments** for pull requests
7. **Important:** This is ONLY for PR previews, not production

#### 3. Enable GitHub Pages (for production)

1. Go to your GitHub repository → **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `root`
4. Click **Save**
5. Your production site will be at: `https://<username>.github.io/<repo>`

**Note:** The GitHub Actions workflow will automatically create the `gh-pages` branch on first merge to main.

**Get GitHub Personal Access Token:**
1. Go to <https://github.com/settings/tokens>
2. Click "Generate new token (classic)"
3. Select scope: `repo` (full control of private repositories)
4. Copy the token and use it for Cloudflare Pages environment variables

#### 4. Test the Upload Feature

The upload API is now at `/api/upload` (same domain as your site):
- **Preview site:** `https://<project>.pages.dev/api/upload`
- **Production site:** `https://<username>.github.io/<repo>/api/upload`

No configuration needed in `app.js` - it automatically uses `/api/upload`!

### How It Works

**Upload to PR:**
1. **User uploads** a markdown file through the web UI
2. **Worker receives** the file and creates a new branch (e.g., `codelab/1234567890-tutorial-name`)
3. **File is committed** to `codelabs/<filename>.md` in the new branch
4. **Pull request is opened** automatically against main branch

**Build Process (runs on every PR and merge):**
5. **Cloudflare Pages triggers build** when PR is created/updated
6. **Build script (`build.sh`) runs:**
   - Downloads `claat` binary (Google's Codelab tool)
   - Converts all `.md` files in `codelabs/` → HTML directories
   - Generates `codelabs.json` catalog index
7. **Preview deployment created** at `https://<branch-name>.<project>.pages.dev`

**Review and Merge:**
8. **You review** the preview URL to see how the codelab looks
9. **Approve and merge** the PR if it looks good
10. **Production site rebuilds** automatically with the new codelab

**File Structure After Build:**
```text
Source Files (in repo):
  codelabs/tutorial.md        ← Uploaded markdown
  functions/api/upload.js     ← Upload API (Pages Function)
  
Built Output (generated by build.sh or GitHub Actions):
  tutorial/index.html         ← Individual codelab page
  tutorial/codelab.json       ← Codelab metadata
  codelabs.json               ← Catalog index
  index.html                  ← Catalog homepage
```

**URLs:**
- Cloudflare Preview: `https://codelab-123-tutorial.pages.dev`
- GitHub Pages Production: `https://<username>.github.io/<repo>`

### Security Notes

- The GitHub token should have **minimal permissions** (only `repo` scope for your specific repository)
- Consider adding authentication to the Worker for production use
- Validate markdown content before merging PRs
- Use Cloudflare Access or similar to restrict who can upload
