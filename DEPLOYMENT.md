# 🚀 Deployment Guide for Mina

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- OpenAI API key
- Database (we'll use Vercel Postgres)

---

## Step 1: Push to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/mina.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### A. Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js - click "Deploy"
5. Your app will deploy (without env vars first)

### B. Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

---

## Step 3: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. In your Vercel project dashboard:
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose your region
   - Click "Create"

2. Vercel will automatically add `DATABASE_URL` to your environment variables

3. Run migrations:
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run prisma:migrate
```

### Option B: Supabase (Free Alternative)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the connection string from Settings → Database
4. Add to Vercel environment variables as `DATABASE_URL`

---

## Step 4: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Variables

```env
# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate-with-command-below>

# Database (auto-added if using Vercel Postgres)
DATABASE_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Optional: OAuth Providers

#### Google OAuth
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
```

**Get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URI:
   - `https://your-app.vercel.app/api/auth/callback/google`

#### Apple OAuth (Advanced)
```env
APPLE_ID=your-apple-id
APPLE_SECRET=your-secret
```

---

## Step 5: Deploy with Environment Variables

After adding environment variables:

1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Check "Use existing Build Cache" is OFF (first time)
4. Click "Redeploy"

Or via CLI:
```bash
vercel --prod
```

---

## Step 6: Test Your Deployment

### 1. Check Build Logs
- In Vercel dashboard, click on your deployment
- Check "Building" and "Checking" logs for errors

### 2. Test Core Features
- ✅ Sign up/Sign in
- ✅ Voice recording (tap & hold)
- ✅ Create assistant
- ✅ Profile page
- ✅ Authentication redirect

### 3. Check Browser Console
- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

### 4. Test on Mobile
- Open your deployment URL on phone
- Test touch interactions
- Test microphone permissions
- Check responsive design

---

## Troubleshooting

### Database Connection Errors
```bash
# Check if DATABASE_URL is set
vercel env ls

# Pull latest env vars
vercel env pull

# Re-run migrations
npm run prisma:migrate
```

### NextAuth Errors
- Ensure `NEXTAUTH_URL` matches your deployment URL (with https://)
- Ensure `NEXTAUTH_SECRET` is set
- Check OAuth redirect URIs match deployment URL

### Build Errors
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check
```

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is valid
- Check API quota/billing
- Test with a simple request

---

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations run successfully
- [ ] OAuth providers configured (if using)
- [ ] HTTPS working (automatic with Vercel)
- [ ] Custom domain connected (optional)
- [ ] Error monitoring set up (Vercel Analytics)
- [ ] Test all features on deployment

---

## Alternative Deployment Options

### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Railway
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Add environment variables
4. Automatic deployments on push

### Docker (Self-hosted)
```dockerfile
# Dockerfile already in project
docker build -t mina .
docker run -p 3000:3000 mina
```

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
- Auto-enabled for all Vercel deployments
- Track page views, performance, etc.

### Error Tracking (Optional)
Add Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Continuous Deployment

Once deployed, Vercel automatically:
- ✅ Deploys on every push to `main`
- ✅ Creates preview deployments for pull requests
- ✅ Runs builds and checks
- ✅ Rolls back on errors

---

## Cost Estimate

**Free Tier (Vercel + Supabase):**
- ✅ Unlimited deployments
- ✅ 500GB bandwidth/month
- ✅ Serverless functions
- ✅ 500MB Postgres database

**Paid Services:**
- OpenAI API: ~$0.002 per audio minute (Whisper) + $0.015 per 1K tokens (GPT)

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Cloud: https://www.prisma.io/docs/guides/deployment

---

## Quick Deploy Button

Add this to your README for one-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/mina)
