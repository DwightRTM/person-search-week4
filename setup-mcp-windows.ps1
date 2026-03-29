# Windows Setup Helper Script
# This script helps Windows users set the DATABASE_URL environment variable

# Navigate to project directory
Set-Location $PSScriptRoot

write-Host "🔧 Person Search MCP Server - Windows Setup Helper" -ForegroundColor Cyan
write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
write-Host ""

# Step 1: Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    write-Host ""
    write-Host "Please create a .env.local file with your DATABASE_URL" -ForegroundColor Yellow
    write-Host "See .env.example for reference" -ForegroundColor Yellow
    exit 1
}

write-Host "✅ Found .env.local" -ForegroundColor Green

# Step 2: Load DATABASE_URL
write-Host "📁 Loading DATABASE_URL from .env.local..." -ForegroundColor Cyan
$env:DATABASE_URL = (Get-Content .env.local | Select-String 'DATABASE_URL' | ForEach-Object { $_ -replace 'DATABASE_URL="', '' } | ForEach-Object { $_ -replace '"$', '' })

if (-not $env:DATABASE_URL) {
    write-Host "❌ Error: DATABASE_URL not found in .env.local!" -ForegroundColor Red
    exit 1
}

write-Host "✅ DATABASE_URL loaded successfully" -ForegroundColor Green
write-Host ""

# Step 3: Offer options
write-Host "Choose an action:" -ForegroundColor Cyan
write-Host "1. Generate Prisma client" -ForegroundColor White
write-Host "2. Deploy database migrations" -ForegroundColor White
write-Host "3. Start MCP server" -ForegroundColor White
write-Host "4. Do all above (1→2→3)" -ForegroundColor White
write-Host ""

$choice = read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        write-Host ""
        write-Host "Generating Prisma client..." -ForegroundColor Cyan
        pnpm prisma generate
        write-Host "✅ Done!" -ForegroundColor Green
    }
    "2" {
        write-Host ""
        write-Host "Deploying database migrations..." -ForegroundColor Cyan
        pnpm prisma migrate deploy
        write-Host "✅ Done!" -ForegroundColor Green
    }
    "3" {
        write-Host ""
        write-Host "Starting MCP server..." -ForegroundColor Cyan
        write-Host "The server is running on stdio." -ForegroundColor Yellow
        write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
        write-Host ""
        pnpm mcp-server
    }
    "4" {
        write-Host ""
        write-Host "Step 1: Generating Prisma client..." -ForegroundColor Cyan
        pnpm prisma generate
        write-Host "✅ Step 1 complete!" -ForegroundColor Green
        write-Host ""
        
        write-Host "Step 2: Deploying database migrations..." -ForegroundColor Cyan
        pnpm prisma migrate deploy
        write-Host "✅ Step 2 complete!" -ForegroundColor Green
        write-Host ""
        
        write-Host "Step 3: Starting MCP server..." -ForegroundColor Cyan
        write-Host "The server is running on stdio." -ForegroundColor Yellow
        write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
        write-Host ""
        pnpm mcp-server
    }
    default {
        write-Host "❌ Invalid choice! Please enter 1-4" -ForegroundColor Red
        exit 1
    }
}
