# Quick Reference Card

Keep this handy while setting up!

---

## 🔑 Information You'll Need

Write these down as you go:

| What | Your Value | Where to Find It |
|------|------------|------------------|
| GitHub Username | _____________ | https://github.com/[THIS] |
| GitHub Repo Name | _____________ | You choose (e.g., "codelabs") |
| GitHub Token | ghp___________ | https://github.com/settings/tokens |
| Cloudflare Pages Project | _____________ | Cloudflare dashboard (auto-generated or you choose) |
| Cloudflare Pages URL | https://_______.pages.dev | Cloudflare Pages → View |
| GitHub Pages URL | https://_____.github.io/_____ | GitHub → Settings → Pages |

---

## 📋 5 Environment Variables for Cloudflare

Copy these EXACT names when adding variables:

```
GITHUB_TOKEN
GITHUB_OWNER
GITHUB_REPO
GITHUB_DEFAULT_BRANCH
CLOUDFLARE_PAGES_PROJECT
```

**IMPORTANT:** Select BOTH "Production" AND "Preview" for each variable!

---

## 🔨 Build Settings for Cloudflare Pages

```
Framework preset:          None
Build command:             bash build.sh
Build output directory:    /
Root directory:            /
```

---

## 📝 Sample Test Codelab

Save this as `test-codelab.md` to test the upload:

```markdown
author: Your Name
summary: Test Codelab
id: test-codelab
categories: test
tags: tutorial
status: Published

# Test Codelab

## Introduction
Duration: 1

This is a test.

## Step 1
Duration: 2

First step content.

## Congratulations
Duration: 1

Done!
```

---

## ⚡ Quick Commands

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main

# Test build locally
bash build.sh

# Serve locally
python -m http.server 8000
```

---

## 🎯 Expected URLs After Setup

**Upload API:**
```
https://your-project.pages.dev/api/upload
```

**Preview (for PRs):**
```
https://codelab-123-filename.your-project.pages.dev
```

**Production:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO
```

---

## ✅ Verification Commands

**Check if repo exists:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO
```

**Check GitHub token scopes:**
```
https://github.com/settings/tokens
```

**Check Cloudflare Pages:**
```
https://dash.cloudflare.com → Workers & Pages
```

**Check GitHub Pages:**
```
GitHub repo → Settings → Pages
```

**Check GitHub Actions:**
```
GitHub repo → Actions tab
```

---

## 🚨 Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Build fails | Check logs in Cloudflare Pages → Deployments |
| Upload returns error | Verify all 5 env vars are set for Production AND Preview |
| GitHub Actions fails | Settings → Actions → Permissions → "Read and write" |
| Preview not generated | Settings → Builds & deployments → Enable previews |
| Token error | Regenerate token with `repo` scope |

---

## 📞 Support Resources

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **GitHub Pages Docs:** https://docs.github.com/pages
- **GitHub Actions Docs:** https://docs.github.com/actions

---

## ⏱️ Expected Timeline

- Step 1 (Push to GitHub): **5 minutes**
- Step 2 (Get token): **2 minutes**
- Step 3 (Cloudflare setup): **10 minutes**
- Step 4 (GitHub Pages): **2 minutes**
- Step 5 (Test upload): **10 minutes**

**Total: ~30 minutes**

---

Print this page and keep it handy! ✨
