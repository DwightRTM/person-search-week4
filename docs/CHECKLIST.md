# MCP Setup Checklist

Use this checklist to ensure you've completed all steps for Claude Desktop integration.

## Phase 1: Installation & Setup ✅

- [ ] **Install dependencies**
  ```bash
  pnpm install
  ```
  - Should complete without errors
  - Installs `@modelcontextprotocol/sdk` and `tsx`

- [ ] **Set up database**
  ```bash
  pnpm prisma generate
  pnpm prisma migrate deploy
  ```
  - Database should be initialized
  - No migration errors

- [ ] **Verify local execution**
  ```bash
  pnpm mcp-server
  ```
  - Should output: "Person Search MCP server running on stdio"
  - Exit with `Ctrl+C`

- [ ] **Test via web interface** (optional but recommended)
  ```bash
  pnpm dev
  # Visit http://localhost:3000/mcp
  ```
  - Should see MCP tester interface
  - Should be able to create and read person records

## Phase 2: Claude Desktop Configuration ✅

### Find Your Config File

**macOS:**
- [ ] Path: `~/Library/Application Support/Claude/claude_desktop_config.json`
- [ ] Create the directory if it doesn't exist
  ```bash
  mkdir -p ~/Library/Application\ Support/Claude
  ```

**Windows:**
- [ ] Path: `%APPDATA%\Claude\claude_desktop_config.json`
- [ ] Use File Explorer: `%APPDATA%` → `Claude` folder
- [ ] Create `Claude` folder if it doesn't exist

**Linux:**
- [ ] Path: `~/.config/Claude/claude_desktop_config.json`
- [ ] Create the directory if it doesn't exist
  ```bash
  mkdir -p ~/.config/Claude
  ```

### Add MCP Server Configuration

- [ ] Open `claude_desktop_config.json` in your text editor
- [ ] Copy the content from `docs/claude_desktop_config.json.example`
- [ ] Update the `cwd` path to your project's absolute path

**Example Windows path:**
```json
{
  "mcpServers": {
    "person-search": {
      "command": "pnpm",
      "args": ["mcp-server"],
      "cwd": "C:\\Users\\YourUsername\\Documents\\bootcamp\\person-search-week4"
    }
  }
}
```

**Example macOS path:**
```json
{
  "mcpServers": {
    "person-search": {
      "command": "pnpm",
      "args": ["mcp-server"],
      "cwd": "/Users/YourUsername/Documents/bootcamp/person-search-week4"
    }
  }
}
```

### Path Requirements

- [ ] Use **absolute paths** (not relative paths)
- [ ] Use **forward slashes** on macOS/Linux
- [ ] Use **backslashes** on Windows (or forward slashes with escaping)
- [ ] No `~` or `$HOME` - use full path starting with `/Users` or `C:\`

## Phase 3: Verification ✅

- [ ] **Close Claude Desktop completely**
  - Not just minimized - fully quit the application

- [ ] **Restart Claude Desktop**
  - Open Claude again
  - Wait 5-10 seconds for server to connect

- [ ] **Open a new conversation**
  - Ask: "What tools do you have available?"
  - You should see person search tools listed

- [ ] **Test a tool**
  - Ask: "Create a person named Test User with email test@example.com"
  - Claude should successfully create the person
  - Should see confirmation response

- [ ] **Verify database changes**
  - Go to `http://localhost:3000/mcp`
  - Use "read_all_people" tool
  - Should see the person you created in Claude

## Troubleshooting ✅

If something doesn't work, check these:

### Claude doesn't recognize tools

- [ ] Verify absolute path in config (no `~` or `$HOME`)
- [ ] Check spelling: `person-search` (exact match required)
- [ ] Verify `pnpm` is in system PATH
  ```bash
  which pnpm  # macOS/Linux
  where pnpm  # Windows
  ```
- [ ] Restart Claude completely (not just switching conversations)
- [ ] Check config file is valid JSON (no syntax errors)

### "pnpm: command not found"

- [ ] Install pnpm globally:
  ```bash
  npm install -g pnpm
  ```
- [ ] Verify installation:
  ```bash
  pnpm --version
  ```
- [ ] Or use full path in config:
  ```json
  {
    "command": "/path/to/pnpm",
    "args": ["mcp-server"]
  }
  ```

### Database errors

- [ ] Verify `.env.local` has correct `DATABASE_URL`
- [ ] Ensure database is running
- [ ] Run migrations:
  ```bash
  pnpm prisma migrate deploy
  ```

### Server won't start

- [ ] Check typescript/node versions:
  ```bash
  node --version  # Should be 18+
  pnpm --version
  ```
- [ ] Reinstall dependencies:
  ```bash
  pnpm install
  ```
- [ ] Generate Prisma:
  ```bash
  pnpm prisma generate
  ```

## Success Criteria ✅

You've successfully set up MCP when:

1. ✅ `pnpm mcp-server` runs without errors
2. ✅ Config file exists at the correct path
3. ✅ Config file has valid JSON syntax
4. ✅ `cwd` points to absolute path of your project
5. ✅ Claude recognizes the tools after restart
6. ✅ Claude can create person records
7. ✅ Changes appear in database/web interface

## Next Steps

Once everything is working:

- Ask Claude to manage your person database
- Use natural language to create, read, update, delete, and search people
- Integrate with your own projects that need person management

## Documentation

- Full setup guide: [MCP-SETUP.md](MCP-SETUP.md)
- Technical details: [MCP-IMPLEMENTATION.md](MCP-IMPLEMENTATION.md)
- Example config: [claude_desktop_config.json.example](claude_desktop_config.json.example)

## Support

If you get stuck:

1. Re-read the section relevant to your issue
2. Check the troubleshooting guide in [MCP-SETUP.md](MCP-SETUP.md)
3. Verify each step in this checklist
4. Check that paths are absolute and correct for your OS
