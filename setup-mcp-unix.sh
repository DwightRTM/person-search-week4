#!/bin/bash

# Unix Setup Helper Script (macOS/Linux)
# This script helps Unix users set up the MCP server

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧 Person Search MCP Server - Unix Setup Helper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo ""
    echo "Please create a .env.local file with your DATABASE_URL"
    echo "See .env.example for reference"
    exit 1
fi

echo "✅ Found .env.local"

# Step 2: Load DATABASE_URL
echo "📁 Loading DATABASE_URL from .env.local..."
export DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d'"' -f2)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not found in .env.local!"
    exit 1
fi

echo "✅ DATABASE_URL loaded successfully"
echo ""

# Step 3: Offer options
echo "Choose an action:"
echo "1. Generate Prisma client"
echo "2. Deploy database migrations"
echo "3. Start MCP server"
echo "4. Do all above (1→2→3)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Generating Prisma client..."
        pnpm prisma generate
        echo "✅ Done!"
        ;;
    2)
        echo ""
        echo "Deploying database migrations..."
        pnpm prisma migrate deploy
        echo "✅ Done!"
        ;;
    3)
        echo ""
        echo "Starting MCP server..."
        echo "The server is running on stdio."
        echo "Press Ctrl+C to stop."
        echo ""
        pnpm mcp-server
        ;;
    4)
        echo ""
        echo "Step 1: Generating Prisma client..."
        pnpm prisma generate
        echo "✅ Step 1 complete!"
        echo ""
        
        echo "Step 2: Deploying database migrations..."
        pnpm prisma migrate deploy
        echo "✅ Step 2 complete!"
        echo ""
        
        echo "Step 3: Starting MCP server..."
        echo "The server is running on stdio."
        echo "Press Ctrl+C to stop."
        echo ""
        pnpm mcp-server
        ;;
    *)
        echo "❌ Invalid choice! Please enter 1-4"
        exit 1
        ;;
esac
