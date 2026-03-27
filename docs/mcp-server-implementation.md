# Person CRUD MCP Server Implementation Plan

## Overview
Implement a Model Context Protocol (MCP) server for Person CRUD operations with Claude Desktop integration and a real-time testing interface in the Next.js app.

## Current State
- ✅ Next.js 16.2.0 with React 19.2
- ✅ Basic CRUD server actions (mock data in-memory)
- ✅ **Prisma installed and configured** *(Phase 1 COMPLETE)*
- ✅ **Supabase PostgreSQL connection setup**
- ✅ **Server actions migrated to use Prisma**
- ❌ No MCP Server yet
- ❌ No MCP testing interface
- ❌ No Claude Desktop integration docs

## Implementation Phases

### Phase 1: Database Setup (Prisma)
**Goal:** Replace in-memory data with persistent database

**Tasks:**
1. Install Prisma and database driver (SQLite for local dev)
2. Create Prisma schema with Person model
3. Generate Prisma client
4. Migrate existing mock data to database
5. Update server actions to use Prisma

**Files to Create/Update:**
- `prisma/schema.prisma`
- `prisma/.env.local` (or `.env.local`)
- Update `app/actions/actions.ts` to use Prisma

### Phase 2: MCP Server Implementation
**Goal:** Create standalone Node.js MCP server for CRUD operations

**Structure:**
```
mcp-server/
├── src/
│   ├── index.ts (MCP server entry point)
│   ├── tools.ts (CRUD tool definitions)
│   ├── db.ts (Prisma client setup)
│   └── types.ts (TypeScript interfaces)
├── package.json
├── tsconfig.json
└── .env
```

**Tasks:**
1. Create separate `mcp-server` directory
2. Install MCP SDK and dependencies
3. Implement CRUD tools:
   - `create_person` - Create new person
   - `read_person` - Get person by ID
   - `read_all_people` - List all people
   - `update_person` - Update person data
   - `delete_person` - Delete person by ID
4. Share Prisma schema with main app
5. Setup environment variables

### Phase 3: MCP Testing Interface in App
**Goal:** Build real-time UI to test MCP functionality

**Components to Create:**
- `app/components/mcp-tester.tsx` - Main test interface
- `app/components/mcp-request-builder.tsx` - Build CRUD requests
- `app/components/mcp-response-viewer.tsx` - Display responses
- `app/mcp/page.tsx` - Full page for MCP testing

**Features:**
- Interactive tool selector
- Request parameter input with validation
- Real-time response display (JSON)
- Request/response history
- Error handling and logging

### Phase 4: Claude Desktop Integration
**Goal:** Enable using MCP Server in Claude Desktop

**Tasks:**
1. Document Claude configuration (`claude_desktop_config.json`)
2. Create setup instructions
3. Test MCP server with Claude Desktop
4. Document authentication (if needed)

### Phase 5: GitHub Repository Setup
**Goal:** Make MCP Server shareable and documented

**Tasks:**
1. Create separate GitHub repo for `mcp-server`
2. Setup README with installation instructions
3. Add quick start guide
4. Document environment setup
5. Add CI/CD (optional)

## Technical Architecture

### Database Schema (Prisma)
```prisma
model Person {
  id    String     @id @default(cuid())
  name  String
  email String     @unique
  phoneNumber String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### MCP Tools Interface
Each tool will expose:
- Input schema (parameters)
- Output schema (response)
- Error handling

### Environment Variables
**Main App (.env.local):**
```
DATABASE_URL="file:./dev.db"
MCP_SERVER_PATH="./mcp-server"
```

**MCP Server (.env):**
```
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

## Dependencies to Install

### Main App
```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### MCP Server
```bash
pnpm add @modelcontextprotocol/sdk
pnpm add @prisma/client
pnpm add dotenv
pnpm add -D typescript
pnpm add -D ts-node
```

## Implementation Order
1. **First:** Prisma setup (Phase 1)
2. **Second:** MCP Server skeleton (Phase 2 - partial)
3. **Third:** App CRUD actions with Prisma (Phase 1 - complete)
4. **Fourth:** MCP tools implementation (Phase 2 - complete)
5. **Fifth:** Testing interface (Phase 3)
6. **Sixth:** Claude Desktop integration (Phase 4)
7. **Seventh:** GitHub repo setup (Phase 5)

## Success Criteria
- ✅ Database persists Person data via Prisma
- ✅ MCP Server performs all CRUD operations
- ✅ Testing interface shows real-time responses
- ✅ Claude Desktop can connect and use MCP Server
- ✅ Clear documentation for setup and usage
- ✅ GitHub repository is accessible and documented

## Next Steps
→ Proceed with Phase 1: Prisma Installation and Schema Setup
