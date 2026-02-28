# Deployment Guide - Render

This guide will walk you through deploying the SAT Learning App to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free tier available at https://render.com)
3. Git installed on your computer

## Step 1: Push to GitHub

### Create a new GitHub repository:

1. Go to https://github.com/new
2. Name your repository (e.g., `sat-learning-app`)
3. Keep it public or private (your choice)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Push your local code to GitHub:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/sat-learning-app.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Deploy to Render

### Option A: Deploy as Static Site (Recommended - Simplest)

1. Go to https://render.com and sign in
2. Click "New +" button in the top right
3. Select "Static Site"
4. Connect your GitHub account if you haven't already
5. Select your `sat-learning-app` repository
6. Configure the site:
   - **Name**: `sat-learning-app` (or any name you prefer)
   - **Branch**: `main`
   - **Root Directory**: (leave blank)
   - **Build Command**: (leave blank or use `echo "No build needed"`)
   - **Publish Directory**: `.` (current directory)
7. Click "Create Static Site"

Render will deploy your app and give you a URL like:
`https://sat-learning-app.onrender.com`

### Option B: Deploy as Web Service (For http-server)

If you want to use the included http-server:

1. Go to https://render.com and sign in
2. Click "New +" button in the top right
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `sat-learning-app`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
6. Click "Create Web Service"

The app will be available at:
`https://sat-learning-app.onrender.com`

## Step 3: Verify Deployment

1. Wait for the deployment to complete (usually 1-2 minutes)
2. Click the URL provided by Render
3. You should see the SAT Learning App home page
4. Test the functionality:
   - Answer a question
   - Check if rewards are calculated
   - Click "Show Learning Resources" to test Khan Academy integration
   - Answer incorrectly to see the "Learn This Concept" button

## Troubleshooting

### Issue: Site shows blank page
**Solution**: Check browser console for errors. Make sure all files were committed to git.

### Issue: Khan Academy lessons not loading
**Solution**: Check that `khan-academy-lessons.json` is in the root directory and accessible.

### Issue: 404 errors for CSS/JS files
**Solution**: Verify that `styles.css` and `app.js` are in the same directory as `index.html`.

### Issue: Deployment fails
**Solution**: Check the Render logs. Make sure package.json is valid and all dependencies are listed.

## Updating Your Deployment

Whenever you make changes to your code:

```bash
# Stage your changes
git add -A

# Commit with a descriptive message
git commit -m "Update: describe your changes here"

# Push to GitHub
git push origin main
```

Render will automatically detect the push and redeploy your site!

## Custom Domain (Optional)

To use your own domain:

1. Go to your Render dashboard
2. Select your static site
3. Go to "Settings" tab
4. Scroll to "Custom Domains"
5. Click "Add Custom Domain"
6. Follow the DNS configuration instructions

## Environment Variables (If Needed Later)

If you add a backend or API keys later:

1. In Render dashboard, go to your service
2. Click "Environment" tab
3. Add environment variables as needed
4. Click "Save Changes"

## Cost

- **Static Site**: FREE forever
- **Web Service (Free Tier)**:
  - FREE for static sites and basic web services
  - Spins down after 15 minutes of inactivity
  - Spins up when someone visits (may take 30 seconds)

For this app, the **Static Site** option is recommended and completely free with no spin-down delays!

## Next Steps

After deployment:

1. Share the URL with students
2. Monitor usage through Render analytics
3. Gather feedback and iterate
4. Add more questions from the `questions.md` file
5. Customize rewards and challenges

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Create issues in your repository

---

**Congratulations!** Your SAT Learning App is now live on the internet! 🎉
