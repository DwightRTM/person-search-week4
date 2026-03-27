# Vercel Deployment Guide for Person Search

## ✅ Prerequisites

- GitHub repository connected to Vercel
- Node.js 18+ (Vercel provides this)
- pnpm configured (already in `vercel.json`)

---

## 🚀 Deployment Steps

### 1. **Push Code to GitHub**
```bash
git add -A
git commit -m "Ready for Vercel deployment"
git push origin next15
```

### 2. **Connect to Vercel**

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `DwightRTM/person-search-week4`
4. Click "Import"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

### 3. **Configure Environment Variables**

In Vercel Dashboard, go to **Settings → Environment Variables** and add:

```
DATABASE_URL = file:./prisma/dev.db
```

**Or for Production Database (Recommended):**

If using Vercel Postgres:
```
DATABASE_URL = [Your PostgreSQL Connection String]
```

If using external database (Neon, PlanetScale, etc.):
```
DATABASE_URL = postgresql://user:password@host/database
```

### 4. **Build & Deploy**

Vercel will:
1. ✓ Install dependencies with pnpm
2. ✓ Run `pnpm run build`
3. ✓ Deploy to Edge Network

**Your app will be live at:** `https://person-search-week4.vercel.app`

---

## 📊 Project Configuration

### Build Settings
- **Framework**: Next.js 16
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Node Version**: 18.x or later

### Environment
- **PNPM_HOME**: `/pnpm`
- **SKIP_ENV_VALIDATION**: `true` (for non-strict validation during build)

### Functions
- **API Timeout**: 60 seconds
- **Region**: Northern Virginia (iad1)

---

## 🗄️ Database Setup for Production

### Option 1: SQLite (Local Development Only)
- **Use for**: Development and local testing
- **Provider**: File-based (`prisma/dev.db`)
- **Limitation**: Won't persist on Vercel (filesystem is ephemeral)

### Option 2: Vercel Postgres (Recommended for Vercel)
1. In Vercel Dashboard: **Settings → Storage**
2. Click **"Create"** → **"Postgres"**
3. Name your database: `person-search-db`
4. Vercel automatically sets `DATABASE_URL` environment variable
5. Run migrations (if needed)

### Option 3: External PostgreSQL
- **Neon**: https://neon.tech (free tier available)
- **PlanetScale**: https://planetscale.com (MySQL)
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases/

**Connection String Format:**
```
postgresql://user:password@host:port/database
```

---

## 🔄 Database Migrations for Production

If you switch to a cloud database, run migrations:

```bash
# Locally generate migration if schema changed
pnpm exec prisma migrate dev --name init

# Push to staging/production database
pnpm exec prisma migrate deploy
```

**Note**: SQLite migrations may not work on Vercel. Use PostgreSQL for production.

---

## 🚨 Troubleshooting

### Build Fails: "Module not found"
- Clear `.next` cache in Vercel
- Check if all dependencies are in `package.json`
- Run `pnpm install` locally to verify

### Build Fails: "TypeScript errors"
- Fix TypeScript errors locally: `pnpm run build`
- Or set `typescript.ignoreBuildErrors: true` in `next.config.ts`

### Database Connection Error
- Verify `DATABASE_URL` is set in Environment Variables
- Check database credentials are correct
- Test locally with same connection string first

### Deployment Hangs
- Check function timeout (set to 60s in `vercel.json`)
- Verify database is accessible from Vercel's IP range

---

## ✨ After Deployment

1. ✅ Test the app: `https://your-app.vercel.app`
2. ✅ Test all CRUD operations
3. ✅ Test MCP interface at `/mcp`
4. ✅ Check logs in Vercel Dashboard if issues occur

---

## 📝 Key Files for Vercel

- `vercel.json` - Vercel configuration
- `.env.example` - Environment variable template
- `next.config.ts` - Next.js optimization
- `package.json` - Scripts and dependencies
- `pnpm-lock.yaml` - Locked dependencies for consistency

---

## 🎯 Summary

Your app is **ready for Vercel deployment!**

**To deploy now:**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Set `DATABASE_URL` environment variable
5. Click **Deploy**

**That's it!** Your app will be live on `vercel.app` domain. 🚀
