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

## Upload Feature (GitHub + Cloudflare Pages Workflow)

The catalog includes a "+ Add Codelab" button that lets users upload markdown files, which automatically:
1. Creates a new branch in your GitHub repository
2. Commits the file to `codelabs/<filename>.md`
3. Opens a pull request for review
4. Generates a Cloudflare Pages preview deployment

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

#### 2. Set Up Cloudflare Pages

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure build settings:
   - **Build command**: `node build-index.js . codelabs.json`
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (root)
5. Enable **Preview deployments** for pull requests

#### 3. Deploy Cloudflare Worker

```bash
cd worker
npm install

# Set environment variables (secrets)
wrangler secret put GITHUB_TOKEN
# Enter your GitHub Personal Access Token (with 'repo' scope)

wrangler secret put GITHUB_OWNER
# Enter your GitHub username or organization

wrangler secret put GITHUB_REPO
# Enter your repository name

wrangler secret put GITHUB_DEFAULT_BRANCH
# Enter: main

wrangler secret put CLOUDFLARE_PAGES_PROJECT
# Enter your Cloudflare Pages project name

# Deploy the worker
npm run deploy
```

**Get GitHub Personal Access Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `repo` (full control of private repositories)
4. Copy the token and use it for `GITHUB_TOKEN`

#### 4. Update Worker URL

After deploying the worker, update the URL in `app.js` around line 535:

```javascript
// Replace with your deployed Worker URL
this.workerUrl = 'https://codelabs-uploader.YOUR_SUBDOMAIN.workers.dev/upload';
```

#### 5. Enable Preview Deployments

In your Cloudflare Pages settings:
- Go to **Settings** → **Builds & deployments**
- Enable **Preview deployments** for pull requests
- Preview URLs will be: `https://<branch-name>.<project>.pages.dev`

### How It Works

1. **User uploads** a markdown file through the web UI
2. **Worker receives** the file and creates a new branch (e.g., `codelab/1234567890-tutorial-name`)
3. **File is committed** to `codelabs/<filename>.md`
4. **Pull request is opened** automatically
5. **Cloudflare Pages builds** a preview deployment from the PR branch
6. **You review** the preview and approve/merge the PR
7. **Production site rebuilds** automatically with the new codelab

### Security Notes

- The GitHub token should have **minimal permissions** (only `repo` scope for your specific repository)
- Consider adding authentication to the Worker for production use
- Validate markdown content before merging PRs
- Use Cloudflare Access or similar to restrict who can upload
