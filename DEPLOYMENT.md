# Portfolio Builder - Deployment Guide

## 🚀 Quick Deploy to Render (Recommended)

### Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit with template updates"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `portfolio-builder`
   - Don't initialize with README
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-builder.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the `portfolio-builder` repository
5. Render will automatically detect the `render.yaml` file
6. Add your environment variable:
   - `GROQ_API_KEY`: Your Groq API key
7. Click "Apply"

Render will:
- Create a PostgreSQL database
- Build your application
- Deploy it to a public URL

**Your app will be live at**: `https://portfolio-builder-XXXX.onrender.com`

---

## 🔄 Alternative Deployment Options

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add PostgreSQL database
6. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `GROQ_API_KEY`
   - `NODE_ENV=production`
7. Deploy!

### Option 3: Deploy to Vercel + Neon

**Frontend (Vercel):**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

**Database (Neon):**
1. Go to https://neon.tech
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add to Vercel environment variables

### Option 4: Back to Replit

1. Go to https://replit.com
2. Click "Create Repl" → "Import from GitHub"
3. Paste your repository URL
4. Replit will auto-detect the configuration
5. Click "Deploy" button in Replit

---

## 🔧 Environment Variables Required

Make sure to set these in your deployment platform:

- `DATABASE_URL` - PostgreSQL connection string (usually auto-set)
- `GROQ_API_KEY` - Your Groq API key for AI features
- `NODE_ENV` - Set to `production`
- `SESSION_SECRET` - Random string for session encryption (optional, will auto-generate)

---

## 📝 Post-Deployment

After deployment:

1. **Run database migrations**:
   - Most platforms will run this automatically
   - If not, run: `npm run db:push`

2. **Test your application**:
   - Create a test account
   - Create a portfolio
   - Test all templates

3. **Custom Domain** (optional):
   - Add your custom domain in your platform's settings
   - Update DNS records as instructed

---

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `NODE_VERSION` is set to 20 or higher

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database is provisioned and running
- Run migrations: `npm run db:push`

### App Crashes on Start
- Check logs in your platform's dashboard
- Verify all environment variables are set
- Ensure port is set correctly (usually auto-detected)

---

## 📞 Support

If you encounter issues:
1. Check the platform's logs
2. Verify environment variables
3. Ensure database is connected
4. Check that the build completed successfully

---

**Note**: The free tier on most platforms may have cold starts (app sleeps after inactivity). For production use, consider upgrading to a paid plan.
