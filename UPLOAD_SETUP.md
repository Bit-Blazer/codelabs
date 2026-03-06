# Upload Workflow Quick Start

This guide walks you through setting up the complete upload → PR → preview → approve workflow.

## Overview

1. User clicks "+ Add Codelab" button
2. Uploads a markdown file
3. Cloudflare Worker creates a GitHub branch and pull request
4. Cloudflare Pages automatically builds a preview
5. You review the preview and approve/merge the PR
6. Production site rebuilds with the new codelab

## Prerequisites

- GitHub account
- Cloudflare account (free tier is fine)
- Node.js installed locally

## Step-by-Step Setup

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Connect Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Authorize GitHub and select your repository
5. Configure build:
   - **Framework preset**: None
   - **Build command**: `node build-index.js . codelabs.json`
   - **Build output directory**: `/`
   - **Root directory**: `/`
6. Click **Save and Deploy**
7. Under **Settings** → **Builds & deployments**, enable:
   - ✅ **Preview deployments** for pull requests
   - ✅ **Automatic deployments** for main branch

### 3. Get GitHub Personal Access Token

1. Visit https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name: `Codelabs Worker`
4. Set expiration (recommended: 90 days, then rotate)
5. Select scopes:
   - ✅ `repo` (full control of private repositories)
6. Click **Generate token**
7. **Copy the token** (you won't see it again!)

### 4. Deploy Cloudflare Worker

```bash
cd worker
npm install
```

Set secrets (you'll be prompted to enter values):

```bash
npx wrangler secret put GITHUB_TOKEN
# Paste the token from step 3

npx wrangler secret put GITHUB_OWNER
# Your GitHub username (e.g., "octocat")

npx wrangler secret put GITHUB_REPO
# Your repository name (e.g., "codelabs")

npx wrangler secret put GITHUB_DEFAULT_BRANCH
# Usually "main"

npx wrangler secret put CLOUDFLARE_PAGES_PROJECT
# Your Cloudflare Pages project name (found in Pages dashboard)
```

Deploy:

```bash
npm run deploy
```

Copy the worker URL from the output (e.g., `https://codelabs-uploader.YOUR_SUBDOMAIN.workers.dev`).

### 5. Update Worker URL in Frontend

Edit `app.js` around line 535:

```javascript
this.workerUrl = "https://codelabs-uploader.YOUR_SUBDOMAIN.workers.dev/upload";
```

Commit and push:

```bash
git add app.js
git commit -m "Add worker URL"
git push
```

### 6. Test the Workflow

1. Visit your Cloudflare Pages site
2. Click the **+ Add Codelab** button
3. Upload a test markdown file
4. Click **Submit PR**
5. You should see:
   - ✅ Success message with PR link
   - ✅ Preview URL (may take 1-2 minutes to build)
6. Click the PR link to review
7. Check the preview URL to see how it looks
8. Merge the PR if it looks good
9. Your production site will rebuild automatically!

## Preview URL Format

Cloudflare Pages creates preview URLs in this format:

```
https://<branch-name>.<pages-project>.pages.dev
```

For example:

```
https://codelab-1234567890-my-tutorial.codelabs.pages.dev
```

## Troubleshooting

### "Server configuration error"

- Check that all Wrangler secrets are set correctly
- Verify the GitHub token has `repo` scope

### "GitHub API error: 404"

- Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Check that the token has access to the repository

### Preview URL not working

- Wait 1-2 minutes for Cloudflare to build
- Check Cloudflare Pages dashboard for build logs
- Verify PR preview deployments are enabled in Pages settings

### PR created but no preview

- Ensure **Preview deployments** is enabled in Cloudflare Pages settings
- Check that the build command is correct
- Review build logs in Cloudflare dashboard

## Environment Variables Reference

| Variable                   | Description                             | Example            |
| -------------------------- | --------------------------------------- | ------------------ |
| `GITHUB_TOKEN`             | Personal access token with `repo` scope | `ghp_xxxxxxxxxxxx` |
| `GITHUB_OWNER`             | GitHub username or org                  | `octocat`          |
| `GITHUB_REPO`              | Repository name                         | `codelabs`         |
| `GITHUB_DEFAULT_BRANCH`    | Default branch name                     | `main`             |
| `CLOUDFLARE_PAGES_PROJECT` | Pages project name                      | `codelabs`         |

## Security Best Practices

1. **Rotate tokens regularly** (every 90 days)
2. **Use minimal scopes** (only `repo` for this specific repository)
3. **Review PRs before merging** - don't auto-merge uploads
4. **Add authentication** to the Worker for production (optional but recommended)
5. **Consider rate limiting** to prevent abuse

## Next Steps

- Add validation rules for markdown format
- Implement authentication for uploads
- Add webhook notifications for new PRs
- Create templates for common codelab types
