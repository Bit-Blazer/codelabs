/**
 * Cloudflare Pages Function for Codelab Upload
 * 
 * Accessible at: /api/upload
 * 
 * This function:
 * 1. Receives markdown file uploads
 * 2. Creates a new branch in GitHub
 * 3. Commits the file to codelabs/<filename>.md
 * 4. Opens a pull request
 * 5. Returns PR URL and preview URL
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers for browser requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return jsonResponse({ error: 'Missing filename or content' }, 400, corsHeaders);
    }

    if (!filename.match(/\.(md|markdown)$/i)) {
      return jsonResponse({ error: 'Only markdown files are allowed' }, 400, corsHeaders);
    }

    // Sanitize filename - remove path traversal attempts
    const safeFilename = filename.replace(/^.*[\\\/]/, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `codelabs/${safeFilename}`;
    
    // Create a unique branch name
    const branchName = `codelab/${Date.now()}-${safeFilename.replace(/\.(md|markdown)$/i, '')}`;
    
    // GitHub API configuration
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const token = env.GITHUB_TOKEN;
    const defaultBranch = env.GITHUB_DEFAULT_BRANCH || 'main';

    if (!owner || !repo || !token) {
      return jsonResponse({ error: 'Server configuration error: Missing GitHub credentials' }, 500, corsHeaders);
    }

    const githubApi = new GitHubAPI(owner, repo, token);

    // 1. Get the default branch's latest SHA
    const refData = await githubApi.getRef(`heads/${defaultBranch}`);
    const baseSha = refData.object.sha;

    // 2. Create a new branch
    await githubApi.createRef(`refs/heads/${branchName}`, baseSha);

    // 3. Create/update the file in the new branch
    const fileContent = btoa(unescape(encodeURIComponent(content))); // Base64 encode
    await githubApi.createOrUpdateFile(
      filePath,
      fileContent,
      `Add new codelab: ${safeFilename}`,
      branchName
    );

    // 4. Create a pull request
    const prData = await githubApi.createPullRequest(
      `Add codelab: ${safeFilename}`,
      branchName,
      defaultBranch,
      `This PR adds a new codelab from uploaded file: ${safeFilename}\n\n` +
      `Please review the content before merging.`
    );

    // 5. Construct preview URL (Cloudflare Pages pattern)
    const prNumber = prData.number;
    const pagesProject = env.CLOUDFLARE_PAGES_PROJECT || repo;
    const previewUrl = `https://${branchName.replace(/[^a-z0-9-]/gi, '-')}.${pagesProject}.pages.dev`;

    return jsonResponse({
      success: true,
      prUrl: prData.html_url,
      prNumber: prNumber,
      previewUrl: previewUrl,
      branch: branchName,
      message: 'Pull request created successfully'
    }, 200, corsHeaders);

  } catch (error) {
    console.error('Error:', error);
    return jsonResponse({
      error: error.message || 'Internal server error'
    }, 500, corsHeaders);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// GitHub API Helper Class
class GitHubAPI {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.baseUrl = 'https://api.github.com';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Pages-Codelab-Uploader',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `GitHub API error: ${response.status}`);
    }

    return data;
  }

  async getRef(ref) {
    return this.request(`/git/refs/${ref}`);
  }

  async createRef(ref, sha) {
    return this.request('/git/refs', {
      method: 'POST',
      body: JSON.stringify({ ref, sha })
    });
  }

  async createOrUpdateFile(path, content, message, branch) {
    // Try to get existing file to get its SHA (for updates)
    let sha = null;
    try {
      const fileData = await this.request(`/contents/${path}?ref=${branch}`);
      sha = fileData.sha;
    } catch (error) {
      // File doesn't exist, that's fine
    }

    return this.request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content,
        branch,
        ...(sha && { sha })
      })
    });
  }

  async createPullRequest(title, head, base, body) {
    return this.request('/pulls', {
      method: 'POST',
      body: JSON.stringify({
        title,
        head,
        base,
        body
      })
    });
  }
}

// Helper to create JSON responses
function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }
  });
}
