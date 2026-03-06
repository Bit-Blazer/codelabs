# Worker Files

This directory contains the Cloudflare Worker for handling codelab uploads.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure secrets (use Cloudflare dashboard or wrangler CLI):
   ```bash
   wrangler secret put GITHUB_TOKEN
   wrangler secret put GITHUB_OWNER
   wrangler secret put GITHUB_REPO
   wrangler secret put GITHUB_DEFAULT_BRANCH
   wrangler secret put CLOUDFLARE_PAGES_PROJECT
   ```

3. Test locally:
   ```bash
   npm run dev
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Environment Variables

- `GITHUB_TOKEN`: GitHub personal access token with `repo` scope
- `GITHUB_OWNER`: Your GitHub username or organization
- `GITHUB_REPO`: Repository name (e.g., "codelabs")
- `GITHUB_DEFAULT_BRANCH`: Default branch name (e.g., "main")
- `CLOUDFLARE_PAGES_PROJECT`: Cloudflare Pages project name
