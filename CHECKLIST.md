# Quick Setup Checklist

Print this and check off each item as you complete it!

---

## □ STEP 1: Push to GitHub (5 min)

- [ ] Open terminal in project folder
- [ ] Run: `git init`, `git add .`, `git commit -m "Initial commit"`
- [ ] Create new repo on https://github.com/new
- [ ] Run: `git remote add origin https://github.com/USERNAME/REPO.git`
- [ ] Run: `git branch -M main`, `git push -u origin main`
- [ ] **Verify:** Code visible on GitHub ✓

---

## □ STEP 2: Get GitHub Token (2 min)

- [ ] Go to https://github.com/settings/tokens
- [ ] Click "Generate new token (classic)"
- [ ] Name: `Codelabs Upload API`
- [ ] Expiration: 90 days
- [ ] Check scope: **`repo`**
- [ ] Click "Generate token"
- [ ] **COPY THE TOKEN** (starts with `ghp_...`) and save it somewhere safe
- [ ] **Verify:** Token copied ✓

---

## □ STEP 3: Setup Cloudflare Pages (10 min)

### A. Create Project (3 min)
- [ ] Go to https://dash.cloudflare.com
- [ ] Click "Workers & Pages"
- [ ] Click "Create application" → "Pages" → "Connect to Git"
- [ ] Authorize GitHub and select your repository
- [ ] Build command: `bash build.sh`
- [ ] Build output directory: `/`
- [ ] Click "Save and Deploy"
- [ ] Wait for initial build (2-3 min)

### B. Add Environment Variables (3 min)
- [ ] Click "Settings" → "Environment variables"
- [ ] Add variable: `GITHUB_TOKEN` = `ghp_xxx...` (from Step 2)
- [ ] Add variable: `GITHUB_OWNER` = `your-username`
- [ ] Add variable: `GITHUB_REPO` = `codelabs` (your repo name)
- [ ] Add variable: `GITHUB_DEFAULT_BRANCH` = `main`
- [ ] Add variable: `CLOUDFLARE_PAGES_PROJECT` = (your Pages project name)
- [ ] For EACH variable: select both "Production" AND "Preview"
- [ ] Click "Save"

### C. Enable Preview Deployments (1 min)
- [ ] Settings → "Builds & deployments"
- [ ] Verify "Preview deployments" is **enabled**
- [ ] Copy your Pages URL (e.g., `https://codelabs-abc.pages.dev`)
- [ ] **Verify:** Pages URL works ✓

---

## □ STEP 4: Enable GitHub Pages (2 min)

- [ ] Go to your GitHub repo → "Settings" → "Pages"
- [ ] Source: "Deploy from a branch"
- [ ] Branch: `gh-pages` (or `main` if gh-pages doesn't exist yet)
- [ ] Folder: `/ (root)`
- [ ] Click "Save"
- [ ] **Verify:** Message appears (OK if it says "disabled" for now) ✓

---

## □ STEP 5: Test Upload (10 min)

### A. Create Test File (2 min)
- [ ] Create `test-codelab.md` on your computer with sample content
- [ ] Save the file

### B. Upload (3 min)
- [ ] Visit your Cloudflare Pages URL
- [ ] Click "+ Add Codelab" button
- [ ] Upload `test-codelab.md`
- [ ] Click "Submit PR"
- [ ] **Verify:** Success message with PR and preview links ✓

### C. Review Preview (3 min)
- [ ] Click "View PR" link
- [ ] Note the PR on GitHub
- [ ] Go to Cloudflare Pages → "Deployments"
- [ ] Wait for preview build to complete (2-3 min)
- [ ] Click preview URL
- [ ] **Verify:** Test codelab appears in catalog ✓

### D. Merge and Check Production (3 min)
- [ ] Go back to GitHub PR
- [ ] Click "Merge pull request"
- [ ] Click "Confirm merge"
- [ ] Go to "Actions" tab
- [ ] Wait for "Deploy to GitHub Pages" workflow (2-3 min)
- [ ] Visit `https://YOUR_USERNAME.github.io/YOUR_REPO`
- [ ] **Verify:** Production site shows the test codelab ✓

---

## ✅ ALL DONE!

**Your URLs:**
- Preview: `https://______.pages.dev` (Cloudflare)
- Production: `https://______.github.io/______` (GitHub Pages)
- Upload API: `/api/upload` (same domain!)

**Total Time:** ~30 minutes

---

## 🚨 If Something Fails

**Build fails?**
→ Check logs: Cloudflare Pages → Deployments → [Build] → Logs

**Upload fails?**
→ Check all 5 environment variables are set for Production AND Preview

**GitHub Actions fails?**
→ Check: Settings → Actions → Workflow permissions → "Read and write"

**Preview not generated?**
→ Check: Settings → Builds & deployments → Preview deployments enabled

---

## 📚 Full Documentation

- Detailed steps: [SETUP_STEPS.md](SETUP_STEPS.md)
- Architecture: [HYBRID_SETUP.md](HYBRID_SETUP.md)
- Technical flow: [FLOW_EXPLAINED.md](FLOW_EXPLAINED.md)
- Quick setup: [UPLOAD_SETUP.md](UPLOAD_SETUP.md)
