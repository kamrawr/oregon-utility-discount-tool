# Deployment Guide

## Quick Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `oregon-utility-discount-tool`
3. Description: "Interactive screening tool for Oregon utility bill discount programs"
4. Keep it **Public** (required for free GitHub Pages)
5. Do NOT initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Push Your Code

```bash
cd ~/Projects/oregon-utility-discount-tool

# Add GitHub as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/oregon-utility-discount-tool.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source":
   - Select **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

### Step 4: Access Your Live Site

After 1-2 minutes, your site will be live at:

```
https://YOUR-USERNAME.github.io/oregon-utility-discount-tool/
```

### Step 5: Update README

Edit `README.md` and replace the placeholder URL on line 5:

```markdown
**Live Site:** [https://YOUR-USERNAME.github.io/oregon-utility-discount-tool/](https://YOUR-USERNAME.github.io/oregon-utility-discount-tool/)
```

Then commit and push:

```bash
git add README.md
git commit -m "Update README with live site URL"
git push
```

## Testing Locally Before Deploy

To test the site locally before pushing to GitHub:

```bash
cd ~/Projects/oregon-utility-discount-tool

# Option 1: Python 3
python3 -m http.server 8000

# Option 2: Node.js
npx http-server

# Then visit: http://localhost:8000
```

## Updating the Site

After making changes to any files:

```bash
cd ~/Projects/oregon-utility-discount-tool
git add .
git commit -m "Description of your changes"
git push
```

GitHub Pages will automatically rebuild and deploy within 1-2 minutes.

## Custom Domain (Optional)

To use a custom domain like `utility-tool.yoursite.org`:

1. Add a `CNAME` file to the root with your domain:
   ```bash
   echo "utility-tool.yoursite.org" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. Configure DNS at your domain registrar:
   - Type: `CNAME`
   - Name: `utility-tool` (or `@` for apex domain)
   - Value: `YOUR-USERNAME.github.io`

3. In GitHub Settings → Pages, add your custom domain and enable HTTPS

## Troubleshooting

### Site not loading after deploy
- Wait 2-3 minutes for initial build
- Check Settings → Pages for deployment status
- Ensure repository is Public
- Clear browser cache

### JavaScript not working
- Open browser console (F12) to check for errors
- Verify all file paths are relative (no absolute paths like `/Users/...`)
- Check that `data/programs.json` is accessible

### Styling issues
- Verify PicoCSS CDN link is loading
- Check Network tab in browser dev tools

## Analytics (Optional)

To add Google Analytics or Plausible:

1. Get your tracking code
2. Add it to the `<head>` section of both `index.html` and `compare.html`
3. Commit and push

## Next Steps

Consider:
- Adding a form for user feedback
- Creating printable PDF versions of results
- Building an admin panel for updating program data
- Adding Spanish language support
- Integrating with LIHEAP application systems
