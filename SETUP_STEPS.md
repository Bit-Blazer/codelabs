# Step-by-Step Setup Guide

Follow these steps IN ORDER to set up your codelab upload system.

---

## ✅ STEP 1: Push Your Code to GitHub

1. Open terminal in your project folder (`d:\Projects\codelabs`)

2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial codelabs setup"
   ```

3. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Repository name: `codelabs` (or whatever you want)
   - Make it **Public** or **Private**
   - **Don't** add README, .gitignore, or license (you already have them)
   - Click **Create repository**

4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values.

5. ✅ **Verify:** Your code should be visible on GitHub

---

## ✅ STEP 2: Get GitHub Personal Access Token

1. Go to https://github.com/settings/tokens

2. Click **"Generate new token"** → **"Generate new token (classic)"**

3. Fill in the form:
   - **Note:** `Codelabs Upload API`
   - **Expiration:** 90 days (you can change later)
   - **Select scopes:**
     - ✅ Check **`repo`** (this gives full control of repositories)

4. Scroll down and click **"Generate token"**

5. **IMPORTANT:** Copy the token NOW (starts with `ghp_...`)
   - You won't be able to see it again!
   - Paste it somewhere safe temporarily (you'll need it in step 3)

6. ✅ **Verify:** You have a token like `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## ✅ STEP 3: Connect Cloudflare Pages

### 3.1 Create Pages Project

1. Go to https://dash.cloudflare.com

2. Log in or create a free account

3. Click **"Workers & Pages"** in left sidebar

4. Click **"Create application"** → **"Pages"** tab → **"Connect to Git"**

5. Click **"Connect GitHub"** (authorize if needed)

6. Select your repository from the list (the one you created in Step 1)

7. Click **"Begin setup"**

### 3.2 Configure Build Settings

1. **Project name:** Keep the auto-generated name or change it (this is your Pages project name)

2. **Production branch:** `main`

3. **Build settings:**
   - Framework preset: **None**
   - Build command: `bash build.sh`
   - Build output directory: `/`
   - Root directory (advanced): `/`

4. Click **"Save and Deploy"**

5. ⏳ Wait 2-3 minutes for initial build (it will succeed or fail, doesn't matter yet)

### 3.3 Add Environment Variables

1. Still in Cloudflare Pages, click **"Settings"** tab

2. Scroll to **"Environment variables"**

3. Click **"Add variable"** and add these 5 variables:

   | Variable Name | Value | Notes |
   |---------------|-------|-------|
   | `GITHUB_TOKEN` | `ghp_xxx...` | Paste the token from Step 2 |
   | `GITHUB_OWNER` | `your-username` | Your GitHub username (lowercase) |
   | `GITHUB_REPO` | `codelabs` | Your repository name |
   | `GITHUB_DEFAULT_BRANCH` | `main` | Your default branch |
   | `CLOUDFLARE_PAGES_PROJECT` | (from 3.2.1) | The project name from 3.2 step 1 |

   For each variable:
   - Type the name
   - Type the value
   - Select **"Production"** and **"Preview"** (both)
   - Click **"Save"**

4. After adding all 5, click **"Save"** at the bottom

### 3.4 Configure Deployment Settings

1. Go to **"Settings"** → **"Builds & deployments"**

2. Scroll to **"Automatic deployments"**
   - **Production branch:** Keep `main` enabled ✅
   - **Preview deployments:** Make sure this is **enabled** ✅

3. Scroll to **"Build configuration"**
   - Verify build command is: `bash build.sh`

4. ✅ **Verify:** Copy your Pages URL (looks like `https://codelabs-abc.pages.dev`)

---

## ✅ STEP 4: Enable GitHub Pages

1. Go to your GitHub repository (https://github.com/YOUR_USERNAME/YOUR_REPO)

2. Click **"Settings"** tab

3. Click **"Pages"** in left sidebar

4. Under **"Source":**
   - Select **"Deploy from a branch"**
   - Branch: **`gh-pages`** (if not visible yet, select `main` for now)
   - Folder: **`/ (root)`**
   - Click **"Save"**

5. **Note:** The `gh-pages` branch will be created automatically when you merge your first PR

6. ✅ **Verify:** You should see a message "GitHub Pages is currently disabled" or "Your site is ready to be published" - both are OK

---

## ✅ STEP 5: Test the Upload Feature

### 5.1 Visit Your Preview Site

1. Go to your Cloudflare Pages URL from Step 3.4
   - Example: `https://codelabs-abc.pages.dev`

2. You should see your codelabs catalog homepage

3. Look for the **"+ Add Codelab"** button in the header

### 5.2 Create a Test Markdown File

Create a file named `test-codelab.md` with this content:

```markdown
author: Your Name
summary: My First Test Codelab
id: test-codelab
categories: test
tags: tutorial
status: Published
feedback link: https://github.com/yourusername/yourrepo/issues

# Test Codelab

## Introduction
Duration: 1

This is a test codelab to verify the upload workflow works.

### What you'll learn
- How to upload codelabs
- How the preview system works

## Step 1
Duration: 2

This is the first step.

Some code:
```javascript
console.log("Hello, Codelabs!");
```

## Congratulations
Duration: 1

You did it!
```

Save this file on your computer.

### 5.3 Upload the File

1. Click **"+ Add Codelab"** button

2. Either:
   - Drag `test-codelab.md` into the upload area, OR
   - Click the upload area and select the file

3. Verify the filename appears

4. Click **"Submit PR"**

5. ⏳ Wait 5-10 seconds

6. You should see:
   - ✅ "Success! Pull request created"
   - A link to the PR
   - A link to the preview URL

### 5.4 Review the Preview

1. Click the **"View PR"** link
   - Opens GitHub - you should see a new pull request

2. Note the branch name (something like `codelab/1234567890-test-codelab`)

3. Go back to Cloudflare Pages dashboard → **"Deployments"**
   - You should see a new preview build starting

4. ⏳ Wait 2-3 minutes for the build to complete

5. The preview URL will be something like:
   ```
   https://codelab-1234567890-test-codelab.codelabs-abc.pages.dev
   ```

6. Click the preview URL and verify you can see your test codelab

### 5.5 Merge the PR

1. Go back to the GitHub PR

2. If the preview looks good, click **"Merge pull request"**

3. Click **"Confirm merge"**

4. Go to **"Actions"** tab in your repository
   - You should see "Deploy to GitHub Pages" workflow running

5. ⏳ Wait 2-3 minutes for it to complete

6. The `gh-pages` branch should now exist

7. Your production site should be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO
   ```

8. ✅ **Verify:** Visit the production URL and see your test codelab!

---

## ✅ STEP 6: Cleanup (Optional)

Now that you've tested, you can delete the test codelab:

1. In your repo, delete `codelabs/test-codelab.md`
2. Delete the `test-codelab/` folder
3. Commit and push
4. The codelabs catalog will automatically update

---

## 🎉 Done!

Your upload system is now ready!

**What you have:**
- ✅ Upload button on your catalog site
- ✅ Automatic PR creation when files are uploaded
- ✅ Cloudflare Pages preview for every PR
- ✅ GitHub Pages production site
- ✅ No email address in any URLs!

**URLs:**
- **Preview:** `https://your-project.pages.dev` (Cloudflare)
- **Production:** `https://YOUR_USERNAME.github.io/YOUR_REPO` (GitHub Pages)
- **Upload API:** `/api/upload` (same domain, no separate worker!)

---

## 📋 Troubleshooting

### Build fails in Cloudflare Pages

**Check:**
1. Cloudflare Pages → Deployments → Click failed build → View logs
2. Common issues:
   - `wget: command not found` → Change build system to Ubuntu (Pages settings)
   - `claat: not found` → Check the download URL is correct
   - Environment variables missing → Verify all 5 are set

### "Server configuration error" when uploading

**Fix:**
1. Cloudflare Pages → Settings → Environment variables
2. Verify all 5 variables are set for both Production AND Preview
3. Redeploy latest deployment

### GitHub Actions fails

**Check:**
1. GitHub → Actions tab → Click failed workflow → View logs
2. Common issues:
   - No permissions → Settings → Actions → Workflow permissions → "Read and write"
   - `claat download fails` → Check the URL in `.github/workflows/deploy-catalog.yml`

### PR created but no preview

**Fix:**
1. Cloudflare Pages → Settings → Builds & deployments
2. Ensure "Preview deployments" is enabled
3. Check that the branch name matches Cloudflare's expectations (it should)

### Production site not updating

**Fix:**
1. GitHub → Settings → Pages
2. Ensure source is set to `gh-pages` branch
3. Check Actions tab to see if workflow completed successfully
4. May take 5-10 minutes for GitHub Pages to update

---

## 🆘 Still Need Help?

**Check logs:**
- Cloudflare Pages: Dashboard → Deployments → [Build] → Logs
- GitHub Actions: Actions tab → [Workflow run] → Logs

**Verify:**
- All 5 environment variables are set in Cloudflare
- GitHub token has `repo` scope
- Both repositories (GitHub & Cloudflare) are connected
- Preview deployments are enabled

**Quick test:**
```bash
# Test build locally
bash build.sh

# If it works locally but not in Cloudflare, check the build environment
```
