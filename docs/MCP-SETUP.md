# MCP Server Setup Guide

## Overview

This guide explains how to set up and integrate the Person Search MCP (Model Context Protocol) server with Claude Desktop.

## What is MCP?

MCP (Model Context Protocol) is a standardized protocol that allows Claude to securely interact with external tools and data sources. This MCP server provides CRUD operations for managing person records.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager installed
- PostgreSQL or SQLite database with Prisma configured
- Claude Desktop app installed

## Installation

### 1. Install Dependencies

```bash
cd person-search-week4
pnpm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP server framework
- `@prisma/client` - Database ORM
- `tsx` - TypeScript executor for running the MCP server

### 2. Set Up Database

First, ensure your `.env.local` file has the `DATABASE_URL` from your database provider.

**Windows PowerShell users:** Run the following before database commands:
```powershell
$env:DATABASE_URL = (Get-Content .env.local | Select-String 'DATABASE_URL' | ForEach-Object { $_ -replace 'DATABASE_URL="', '' } | ForEach-Object { $_ -replace '"$', '' })
```

Then run:
```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

### 3. Verify MCP Server Runs

**Windows PowerShell users:** Set the environment variable first:
```powershell
$env:DATABASE_URL = (Get-Content .env.local | Select-String 'DATABASE_URL' | ForEach-Object { $_ -replace 'DATABASE_URL="', '' } | ForEach-Object { $_ -replace '"$', '' })
```

Then run:
```bash
pnpm mcp-server
```

You should see:
```
Person Search MCP server running on stdio
```

Press `Ctrl+C` to stop.

## Claude Desktop Integration

### Step 1: Locate Claude Desktop Config

The configuration file location depends on your installation:

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows (Standard Installation):**
```
%APPDATA%\Claude\claude_desktop_config.json
C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json
```

**Windows (Microsoft Store Version):**
```
C:\Users\YourUsername\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

**How to know which version you have?**
- Open PowerShell and run: `explorer "$env:APPDATA\Claude"`
- If the folder exists → use Standard path
- If it doesn't exist → you likely have Store version, use the path in `AppData\Local\Packages\Claude_...`

### Step 2: Update Configuration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "person-search": {
      "command": "pnpm",
      "args": ["mcp-server"],
      "cwd": "/path/to/person-search-week4"
    }
  }
}
```

**Important:** Replace `/path/to/person-search-week4` with your actual project path.

**Examples:**
- macOS: `/Users/username/Documents/bootcamp/person-search-week4`
- Windows: `C:\\Users\\username\\Documents\\bootcamp\\person-search-week4`
- Linux: `/home/username/Documents/bootcamp/person-search-week4`

### Step 3: Restart Claude Desktop

1. Close Claude Desktop completely
2. Launch Claude Desktop again
3. The MCP server should now be connected

### Step 4: Verify Connection

1. Open a new conversation in Claude
2. Ask Claude about the person search tools:
   - "What tools do you have available?"
   - You should see the person search tools listed

## Available Tools

The MCP server exposes these tools to Claude:

### 1. `create_person`
Create a new person record.
```
Input: name (required), email (required), phoneNumber (optional)
```

### 2. `read_person`
Get a person by ID.
```
Input: id (required)
```

### 3. `read_all_people`
Get all people in the database.
```
Input: none
```

### 4. `update_person`
Update a person's information.
```
Input: id (required), name/email/phoneNumber (optional)
```

### 5. `delete_person`
Delete a person by ID.
```
Input: id (required)
```

### 6. `search_people`
Search for people by name.
```
Input: query (required)
```

## Using the MCP Server with Claude

Once configured, you can ask Claude to:

- "Create a new person named John Doe with email john@example.com"
- "Find all people named Smith"
- "Update the email for person with ID xyz123"
- "Delete the person with ID abc456"
- "Get a list of all people in the database"

Claude will automatically call the appropriate MCP tools to perform these operations.

## Troubleshooting

### Claude Desktop doesn't recognize the server

1. **Check the path:** Ensure the `cwd` in `claude_desktop_config.json` is an absolute path
2. **Check pnpm:** Verify that `pnpm` is in your system PATH by running `pnpm --version` in a terminal
3. **Restart Claude:** Close and reopen Claude Desktop
4. **Check logs:** Look in Claude Desktop's developer console (Shift+Cmd+I on macOS)

### Server starts but tools aren't available

1. Ensure the database is initialized: `pnpm prisma migrate deploy`
2. Restart Claude Desktop completely
3. Verify the MCP server runs locally: `pnpm mcp-server`

### "Command not found: pnpm"

Install pnpm globally:
```bash
npm install -g pnpm
```

Or use the full path to pnpm in your config.

### Database connection errors

1. Check your `.env.local` file has the correct `DATABASE_URL`
2. Ensure your database is running
3. Run migrations: `pnpm prisma migrate deploy`

## Development

### Run MCP Server Locally

```bash
pnpm mcp-server
```

### Test Tools via Web Interface

```bash
pnpm dev
# Visit http://localhost:3000/mcp
```

### Build Production Version

```bash
pnpm build
# Creates optimized MCP server in dist/
```

## Architecture

```
┌─ Claude Desktop ─────────┐
│                          │
│  Uses MCP Protocol       │
│        │                 │
│        ▼                 │
│  mcp-server.ts ◄────────┼─ stdio transport
│  (Node.js process)      │
│        │                 │
│        ▼                 │
│  @prisma/client          │
│        │                 │
│        ▼                 │
│  PostgreSQL/SQLite       │
│                          │
└──────────────────────────┘
```

## Security Notes

- The MCP server runs as a local process and only handles stdio communication
- Database credentials are read from your `.env.local` file
- The server does not expose any HTTP endpoints
- All communication is between Claude and your local MCP server

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up database
3. ✅ Test MCP server locally
4. ✅ Configure Claude Desktop
5. ✅ Start using person search tools in Claude!

For more information about MCP, visit: https://modelcontextprotocol.io/
