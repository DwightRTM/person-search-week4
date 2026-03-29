@echo off
REM Wrapper script to load environment variables and start MCP server
REM This script is called by Claude Desktop to start the MCP server

setlocal enabledelayedexpansion

REM Get the project directory
set PROJECT_DIR=%~dp0

REM Load DATABASE_URL from .env.local
for /f "tokens=2 delims==" %%A in ('findstr "DATABASE_URL" "%PROJECT_DIR%.env.local"') do (
    set "DATABASE_URL=%%A"
    REM Remove surrounding quotes
    set "DATABASE_URL=!DATABASE_URL:"=!"
)

REM If DATABASE_URL is not set, exit with error
if "!DATABASE_URL!"=="" (
    echo Error: DATABASE_URL not found in .env.local
    exit /b 1
)

REM Set the environment variable
set DATABASE_URL=!DATABASE_URL!

REM Change to project directory
cd /d "%PROJECT_DIR%"

REM Run tsx directly without any preamble
"%PROJECT_DIR%node_modules\.bin\tsx.cmd" "%PROJECT_DIR%mcp-server.ts"

endlocal
