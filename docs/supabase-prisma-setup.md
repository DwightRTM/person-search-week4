# Supabase + Prisma Setup Guide

## Step 1: Create a Supabase Project

1. Navigate to **[Supabase](https://supabase.com)**
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Project Name:** e.g., "person-search"
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose one closest to you
5. Wait for the project to initialize (2-3 minutes)

## Step 2: Get Your Database Connection String

1. In your Supabase dashboard, go to **Settings** (gear icon on left sidebar)
2. Click **"Database"** in the settings menu
3. Under **Connection String**, select **"URI"** format (should show):
   ```
   postgresql://postgres:[password]@[host]:[port]/postgres?sslmode=require
   ```
4. Copy this entire string

## Step 3: Configure .env.local

1. In your project root, create a new file called `.env.local` (note: NOT `.env.example`)
2. Paste your connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST].supabase.co:5432/postgres?sslmode=require"
   ```
3. Replace `[YOUR_PASSWORD]` with the database password you created in Step 1

## Step 4: Create Database Tables

Run the Prisma migration command to create the `Person` table:

```bash
pnpm dlx prisma migrate dev --name init
```

This will:
- Create a new migration file
- Apply migrations to your Supabase database
- Generate the Prisma client

## Step 5: Seed Initial Data (Optional)

To add the initial person records, you can use Prisma Studio:

```bash
pnpm dlx prisma studio
```

This opens a UI where you can manually add Person records.

Or run the updated server actions which will populate data via Prisma.

## Troubleshooting

### Connection Timeout
- Check if your Supabase project is active
- Verify the DATABASE_URL is correct
- Wait a few moments and retry

### SSL Error
- Ensure `?sslmode=require` is at the end of your connection string
- Make sure you're using the "URI" format, not "Connection pooler"

### Migration Fails
- Check that your connection string is correct
- Verify your database password doesn't have special characters that need encoding
- Check Supabase project status in the dashboard

## What's Next?

After completing these setup steps, proceed with:
- [MCP Server Implementation](./mcp-server-implementation.md) to create the separate MCP server
- Update [app/actions/actions.ts](../app/actions/actions.ts) to use Prisma instead of mock data
