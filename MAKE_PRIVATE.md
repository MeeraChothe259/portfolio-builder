# How to Make Your Repository Private

## Option 1: Via GitHub Website (Easiest)

1. Go to your repository: https://github.com/MeeraChothe259/portfolio-builder
2. Click **"Settings"** (top right)
3. Scroll down to the **"Danger Zone"** section
4. Click **"Change visibility"**
5. Select **"Make private"**
6. Type the repository name to confirm
7. Click **"I understand, change repository visibility"**

## Option 2: Via GitHub CLI

```bash
# Install GitHub CLI if you haven't
# Then run:
gh repo edit MeeraChothe259/portfolio-builder --visibility private
```

---

## After Making it Private

### Deploy to Render (with Private Repo)

1. Go to https://render.com
2. Sign in with GitHub
3. When connecting, **authorize Render to access private repositories**
4. Select your private repo: `MeeraChothe259/portfolio-builder`
5. Deploy as normal!

### Deploy to Railway (with Private Repo)

1. Go to https://railway.app
2. Sign in with GitHub
3. Railway will ask for permission to access private repos
4. Grant access
5. Select your private repo and deploy!

---

## Important Notes

- ✅ **Your code stays private** - Only you and authorized services can see it
- ✅ **Deployment platforms need access** - You'll grant them permission during setup
- ✅ **No extra cost** - Private repos are free on GitHub (up to certain limits)
- ✅ **Your deployed app is still public** - The website will be accessible to everyone, but the source code remains private

---

## Security Best Practices

Even with a private repo, make sure:
- ✅ `.env` is in `.gitignore` (already done)
- ✅ API keys are set as environment variables in deployment platform
- ✅ Never commit sensitive credentials to git
- ✅ Use environment variables for all secrets
