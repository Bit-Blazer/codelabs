# Complete Upload & Build Flow

This document explains the **complete technical flow** from upload to published codelab.

## Visual Flow Diagram

```
┌─────────────┐
│   Browser   │  User clicks "+ Add Codelab"
│  (User UI)  │  Selects tutorial.md file
└──────┬──────┘
       │ POST /upload
       │ {filename: "tutorial.md", content: "..."}
       ↓
┌──────────────────┐
│ Cloudflare Worker│  1. Creates branch: codelab/1234567890-tutorial
│  (Upload API)    │  2. Commits to: codelabs/tutorial.md
└────────┬─────────┘  3. Opens PR to main branch
         │
         │ GitHub API calls
         ↓
┌─────────────────┐
│  GitHub Repo    │  New PR created!
│  (Source Code)  │  Branch: codelab/1234567890-tutorial
└────────┬────────┘  File: codelabs/tutorial.md
         │
         │ Webhook notification
         ↓
┌──────────────────────┐
│  Cloudflare Pages    │  Detects PR → Starts preview build
│  (Build & Deploy)    │
└──────────┬───────────┘
           │
           │ Runs: bash build.sh
           ↓
     ┌─────────────┐
     │  Build Step │
     └─────────────┘
           │
    ┌──────┴──────────────────────────┐
    │                                  │
    ↓                                  ↓
[1] Download claat               [2] Export Markdown
    binary (Linux)                   to HTML codelabs
                                     
    wget claat-linux-amd64           for file in codelabs/*.md:
    chmod +x claat                     ./claat export -o . file
                                     
    Result:                          Result:
    ./claat (executable)             tutorial/ (HTML folder)
                                     ├── index.html
    │                                ├── codelab.json
    │                                └── img/
    │                                  
    └──────┬───────────────────────────┘
           │
           ↓
    [3] Build Catalog Index
        
        node build-index.js . codelabs.json
        
        Scans all */codelab.json files
        Generates: codelabs.json
        
           │
           ↓
┌──────────────────────┐
│  Build Output        │  Final directory structure:
│  (Static Files)      │  /
└──────────┬───────────┘  ├── index.html (catalog)
           │              ├── app.js
           │              ├── style.css
           │              ├── codelabs.json (catalog index)
           │              ├── tutorial/ (exported codelab)
           │              │   ├── index.html
           │              │   └── codelab.json
           │              └── codelabs/ (source .md files)
           │                  └── tutorial.md
           ↓
┌──────────────────────┐
│  Preview Deployment   │  URL: https://codelab-123-tutorial.project.pages.dev
│  (Cloudflare CDN)     │
└──────────┬────────────┘  You can now preview the codelab!
           │
           │ After review & approval
           ↓
┌──────────────────────┐
│  Merge PR to main     │  PR merged!
└──────────┬────────────┘
           │
           │ Triggers production build
           ↓
┌──────────────────────┐
│ Production Deployment │  Same build process runs on main branch
│ (Your Live Site)      │  URL: https://your-project.pages.dev
└───────────────────────┘
```

## Step-by-Step Technical Details

### Phase 1: Upload (Frontend → Worker)

**File:** `app.js` (CodelabUploadManager class)

```javascript
// User selects tutorial.md
// Frontend reads file content
const content = await readFileAsText(file);

// POST to Worker
fetch('https://worker.dev/upload', {
  body: JSON.stringify({
    filename: 'tutorial.md',
    content: '# Tutorial content...'
  })
});
```

### Phase 2: PR Creation (Worker → GitHub)

**File:** `worker/index.js`

```javascript
// 1. Get main branch SHA
const ref = await github.getRef('heads/main');
const baseSha = ref.object.sha;

// 2. Create new branch
const branchName = 'codelab/1234567890-tutorial';
await github.createRef(`refs/heads/${branchName}`, baseSha);

// 3. Commit file
const base64Content = btoa(content);
await github.createOrUpdateFile(
  'codelabs/tutorial.md',
  base64Content,
  'Add new codelab: tutorial.md',
  branchName
);

// 4. Open PR
const pr = await github.createPullRequest(
  'Add codelab: tutorial.md',
  branchName,  // from
  'main',      // to
  'Please review this new codelab'
);

// Returns: { prUrl, previewUrl }
```

### Phase 3: Build (Cloudflare Pages)

**File:** `build.sh`

```bash
#!/bin/bash

# Step 1: Download claat
wget https://github.com/googlecodelabs/tools/releases/download/v2.2.6/claat-linux-amd64 -O claat
chmod +x claat

# Step 2: Convert MD → HTML
for mdfile in codelabs/*.md; do
  ./claat export -o . "$mdfile"
  # Creates: tutorial/ directory with index.html
done

# Step 3: Build catalog
node build-index.js . codelabs.json
# Scans all */codelab.json, creates codelabs.json
```

**What `claat export` does:**

```
Input:  codelabs/tutorial.md
Output: tutorial/
        ├── index.html       (Interactive codelab)
        ├── codelab.json     (Metadata for catalog)
        └── img/             (Any images)
```

**What `build-index.js` does:**

```javascript
// Scans for all */codelab.json files
const codelabs = findCodelabsInDirectory('.');
// [
//   { 
//     id: 'tutorial',
//     title: 'My Tutorial',
//     url: 'tutorial/',
//     ...metadata from codelab.json
//   }
// ]

// Writes to codelabs.json
fs.writeFileSync('codelabs.json', JSON.stringify(codelabs));
```

### Phase 4: Deployment

**Cloudflare Pages:**
- Uploads all files to CDN
- Generates preview URL: `https://<branch-name>.<project>.pages.dev`
- Catalog loads `codelabs.json` and displays the new codelab

## Key Files and Their Roles

| File | Purpose | When It Runs |
|------|---------|--------------|
| `app.js` | Upload UI, sends file to Worker | Browser (user clicks upload) |
| `worker/index.js` | Creates PR with MD file | Cloudflare Worker (on upload) |
| `build.sh` | Downloads claat, exports MD→HTML, builds index | Cloudflare Pages (build time) |
| `build-index.js` | Scans HTML codelabs, generates catalog JSON | Called by build.sh |
| `codelabs/*.md` | Source markdown files | Stored in repo |
| `*/codelab.json` | Metadata for each codelab | Generated by claat |
| `codelabs.json` | Catalog index (list of all codelabs) | Generated by build-index.js |
| `index.html` | Catalog homepage UI | Loads codelabs.json and displays cards |

## Why This Architecture?

1. **Separation of Concerns:**
   - Worker: Handles upload → GitHub PR (can scale independently)
   - Pages: Handles build → deploy (automated, stateless)

2. **Preview Before Merge:**
   - Every PR gets a preview URL
   - You can test the codelab before it goes live
   - Safe to experiment

3. **Static & Fast:**
   - Everything is pre-built HTML
   - No server needed
   - Served from Cloudflare CDN worldwide

4. **Git-Based Workflow:**
   - All changes tracked in Git
   - Easy to revert bad codelabs
   - Collaborative review process

## Troubleshooting

**Q: PR created but build fails?**
- Check Cloudflare Pages build logs
- Common issue: `claat` download failed (check network/firewall)
- Solution: Check `build.sh` runs successfully locally first

**Q: Build succeeds but codelab not in catalog?**
- Check if `tutorial/codelab.json` was created
- Verify `codelabs.json` includes the new entry
- Check browser console for JSON load errors

**Q: Preview URL shows old content?**
- Cloudflare Pages caches builds
- Wait ~30 seconds, hard refresh (Ctrl+Shift+R)
- Check the build timestamp in Pages dashboard

**Q: How to test locally?**
```bash
# Run the build script
bash build.sh

# Serve locally
python -m http.server 8000

# Visit http://localhost:8000
```
