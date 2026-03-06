# Upload Workflow Quick Start (Hybrid Setup)

This guide walks you through setting up the complete upload → PR → preview → approve workflow.

## Architecture Overview

**Hybrid Model: Best of Both Worlds**

- **Cloudflare Pages:** PR preview deployments (instant feedback)
- **GitHub Pages:** Production site (stable, free, version-controlled)
- **Cloudflare Pages Functions:** Upload API at `/api/upload` (no email in URL!)

## Complete Flow

1. User clicks "+ Add Codelab" button
2. Uploads a markdown file → Sent to `/api/upload` (Pages Function)
3. Pages Function creates GitHub branch and pull request
4. **Cloudflare Pages builds PR preview** (for review)
5. You review the preview and approve/merge the PR
6. **GitHub Actions builds and deploys to gh-pages** (production)

## Prerequisites

- GitHub account
- Cloudflare account (free tier works!)
- Node.js installed locally (for testing)

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

### 2. Connect Cloudflare Pages (Preview Builds Only)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Authorize GitHub and select your repository
5. Configure build:
   - **Framework preset**: None
   - **Build command**: `bash build.sh`
   - **Build output directory**: `/`
   - **Root directory**: `/`
6. Go to **Settings** → **Environment variables** and add:
   | Variable | Value |
   |----------|-------|
   | `GITHUB_TOKEN` | Your GitHub token (from step 3) |
   | `GITHUB_OWNER` | Your GitHub username |
   | `GITHUB_REPO` | Your repository name |
   | `GITHUB_DEFAULT_BRANCH` | `main` |
   | `CLOUDFLARE_PAGES_PROJECT` | Your Pages project name |
7. Under **Settings** → **Builds & deployments**, enable:
   - ✅ **Preview deployments** for pull requests
   - ⚠️ **Disable** production deployments (we use GitHub Pages for that)

### 3. Get GitHub Personal Access Token

1. Visit https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name: `Codelabs Worker`
4. Set expiration (recommended: 90 days, then rotate)
5. Select scopes:
   - ✅ `repo` (full control of private repositories)
6. Click **Generate token**
7. **Copy the token** (you won't see it again!)
8. Use this token in Cloudflare Pages environment variables (step 2)

### 4. Enable GitHub Pages (Production Site)

1. Go to your GitHub repository → **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `root`
4. Click **Save**
5. Your production site will be: `https://YOUR_USERNAME.github.io/YOUR_REPO`

**Note:** The `gh-pages` branch will be created automatically when you merge your first PR (GitHub Actions workflow handles this).

### 5. Test the Workflow

1. Visit your Cloudflare Pages preview site (the URL from Cloudflare dashboard)
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
8. **Merge the PR** if it looks good
9. **GitHub Actions automatically deploys to production** (gh-pages branch)
10. Your production site updates at `https://YOUR_USERNAME.github.io/YOUR_REPO`

## URL Structure

**Preview (Cloudflare Pages):**
```

https://codelab-1234567890-tutorial.<project>.pages.dev

```

**Production (GitHub Pages):**
```

https://YOUR_USERNAME.github.io/YOUR_REPO

```

**Upload API (Pages Function):**
```

https://<project>.pages.dev/api/upload (preview)
https://YOUR_USERNAME.github.io/YOUR_REPO/api/upload (production)

```

No email address visible anywhere! 🎉

## Troubleshooting

### "Server configuration error"

- Check Cloudflare Pages **Environment variables** are set correctly
- Verify the GitHub token has `repo` scope
- Ensure all 5 environment variables are present

### "GitHub API error: 404"

- Verify `GITHUB_OWNER` and `GITHUB_REPO` match your repository
- Check that the GitHub token has access to the repository
- Ensure the token hasn't expired

### Preview URL not working

- Wait 1-2 minutes for Cloudflare Pages to build
- Check **Cloudflare Pages dashboard** → **Deployments** for build logs
- Verify PR preview deployments are enabled in Pages settings
- Check `build.sh` downloads claat successfully

### PR created but no preview

- Ensure **Preview deployments** is enabled in Cloudflare Pages settings
- Check that Pages build command is `bash build.sh`
- Review build logs in Cloudflare dashboard for errors

### Production deploys not working

- Check GitHub Actions tab for workflow errors
- Ensure `gh-pages` branch exists (created automatically on first merge)
- Verify GitHub Pages is enabled in repository settings
- Check GitHub Actions has write permissions

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
```
