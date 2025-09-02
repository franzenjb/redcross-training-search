# Deployment Instructions for GitHub Pages

## Quick Deploy (5 minutes)

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it: `redcross-training-search`
4. Keep it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd ~/redcross-training-search

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/redcross-training-search.git

# Push the code
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (in the repository navigation)
3. Scroll down to **Pages** (in the left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select **main**
6. Leave folder as **/ (root)**
7. Click **Save**

### Step 4: Access Your Site

- Your site will be available at: `https://YOUR_USERNAME.github.io/redcross-training-search/`
- It may take 2-10 minutes to go live the first time
- Check the Pages settings page for the status

## Alternative: Using GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Click **File** → **Add Local Repository**
3. Browse to `~/redcross-training-search`
4. Click **Publish repository**
5. Follow Step 3 above to enable GitHub Pages

## Testing Locally

Before deploying, test locally:

```bash
cd ~/redcross-training-search
python3 -m http.server 8000
```

Visit: http://localhost:8000

## Updating the Site

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

GitHub Pages will automatically update within a few minutes.

## Custom Domain (Optional)

To use a custom domain like `training.redcross.org`:

1. In Pages settings, add your custom domain
2. Create a `CNAME` file in the repository root with your domain
3. Configure your DNS:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or CNAME record: `YOUR_USERNAME.github.io`

## Troubleshooting

### Site not loading?
- Check Settings → Pages for any error messages
- Ensure repository is public
- Wait 10 minutes for initial deployment
- Check https://github.com/YOUR_USERNAME/redcross-training-search/actions for build status

### 404 Error?
- Verify the URL includes `/redcross-training-search/`
- Check that index.html exists in the root
- Ensure GitHub Pages is enabled

### Changes not showing?
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 2-5 minutes for GitHub to rebuild
- Check commit was pushed successfully

## Features After Deployment

Once deployed, users can:
- Search 342 training courses instantly
- Filter by category, level, delivery method, duration
- Bookmark courses (saved in browser)
- Access on any device
- Share course links
- Work offline after first visit

## Support

For deployment help:
- GitHub Pages docs: https://docs.github.com/pages
- GitHub Status: https://githubstatus.com
- Create an issue in the repository

---

Ready to deploy! The entire process takes less than 5 minutes. 🚀