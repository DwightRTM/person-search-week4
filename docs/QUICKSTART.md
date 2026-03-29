# Quick Start: MCP Setup in 5 Minutes

## TL;DR - Just the essentials

### Option A: Automated Setup (Recommended)

**Windows PowerShell:**
```powershell
.\setup-mcp-windows.ps1
```
Then choose option 4 to do everything automatically.

**macOS/Linux:**
```bash
chmod +x ./setup-mcp-unix.sh
./setup-mcp-unix.sh
```
Then choose option 4 to do everything automatically.

### Option B: Manual Setup

#### Step 1: Install & Test (2 min)
```bash
cd person-search-week4
pnpm install
pnpm mcp-server
# Should print: "Person Search MCP server running on stdio"
# Press Ctrl+C to stop
```

**Note for Windows Users:** Before running Prisma or MCP commands, set the DATABASE_URL:
```powershell
$env:DATABASE_URL = (Get-Content .env.local | Select-String 'DATABASE_URL' | ForEach-Object { $_ -replace 'DATABASE_URL="', '' } | ForEach-Object { $_ -replace '"$', '' })
```

#### Step 2: Configure Claude Desktop (2 min)

**Find your config file:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Add this to the file:**
```json
{
  "mcpServers": {
    "person-search": {
      "command": "pnpm",
      "args": ["mcp-server"],
      "cwd": "YOUR_ABSOLUTE_PROJECT_PATH"
    }
  }
}
```

**Get your absolute path:**

macOS/Linux:
```bash
cd person-search-week4
pwd  # Copy this path
```

Windows PowerShell:
```powershell
cd person-search-week4
pwd  # Copy this path
```

### Step 3: Restart & Test (1 min)

1. **Fully quit Claude Desktop** (not just minimize)
2. **Open Claude again** - wait 5 seconds
3. **Ask Claude:** "What tools do you have?"
4. **Done!** You should see person search tools listed

## If It Doesn't Work

### Claude doesn't show tools?
- [ ] Is the path absolute? (no `~`, no `$HOME`)
- [ ] Did you fully quit and restart Claude?
- [ ] Is the JSON valid? (use jsonlint.com to check)

### Command not found: pnpm?
```bash
npm install -g pnpm
```

### Server won't start?
```bash
pnpm install
pnpm prisma generate
```

## What You Can Now Do

Ask Claude things like:
- "Create a person named John with email john@example.com"
- "Find all people named Smith"
- "Update John's email to newemail@example.com"
- "Delete the person with ID abc123"
- "Show me all people"

## Full Documentation

- **Setup Details:** [MCP-SETUP.md](MCP-SETUP.md)
- **Implementation:** [MCP-IMPLEMENTATION.md](MCP-IMPLEMENTATION.md)
- **Complete Checklist:** [CHECKLIST.md](CHECKLIST.md)
- **Config Template:** [claude_desktop_config.json.example](claude_desktop_config.json.example)

That's it! Enjoy using Claude with your person database.
