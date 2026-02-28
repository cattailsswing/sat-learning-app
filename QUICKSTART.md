# Quick Start Guide - Deploy to Render in 5 Minutes

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `sat-learning-app`
3. Keep it **Public**
4. **Don't** check any initialization options
5. Click **"Create repository"**

## Step 2: Push Code to GitHub (1 minute)

Copy and paste these commands in your terminal:

```bash
# Make sure you're in the project directory
cd /Users/brookechen/sat-learning-app

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sat-learning-app.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Render (2 minutes)

1. Go to https://render.com/signup and create a free account
2. Click **"New +"** → **"Static Site"**
3. Click **"Connect GitHub"** and authorize Render
4. Find and select your `sat-learning-app` repository
5. Use these settings:
   - **Name**: `sat-learning-app` (or anything you want)
   - **Branch**: `main`
   - **Build Command**: Leave blank
   - **Publish Directory**: `.`
6. Click **"Create Static Site"**

## Step 4: Done! 🎉

Wait 1-2 minutes for deployment to complete. Render will give you a URL like:

```
https://sat-learning-app.onrender.com
```

Click it to see your live app!

## What You Get

✅ Free hosting forever
✅ Automatic HTTPS
✅ Fast CDN
✅ Auto-deploy when you push to GitHub
✅ No credit card required

## Test Your Deployment

1. Open the URL Render gave you
2. Answer a question correctly → See game time rewards
3. Answer incorrectly → Click "📚 Learn This Concept"
4. Check that Khan Academy links work
5. Try keyboard shortcuts (A/B/C/D to select, Enter to submit)

## Common Issues & Fixes

**"Repository not found"**
→ Make sure you pushed to GitHub first (Step 2)

**"Blank page"**
→ Check Render logs. Usually means files didn't upload correctly

**"Can't connect GitHub"**
→ Authorize Render in your GitHub settings

## Updating Your Site

After making changes:

```bash
git add -A
git commit -m "Describe your changes"
git push origin main
```

Render automatically redeploys! ✨

## Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
- Render Docs: https://render.com/docs/static-sites
- Open an issue on GitHub

---

**That's it!** Your SAT Learning App is live on the internet! 🚀
