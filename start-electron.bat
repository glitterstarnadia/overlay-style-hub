@echo off
echo ========================================
echo   Nadia ^<3 Electron Build Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if NPM is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: NPM is not installed or not in PATH
    pause
    exit /b 1
)

echo Node.js and NPM are available
echo.

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

echo Building React application...
npm run build
if errorlevel 1 (
    echo ERROR: React build failed
    pause
    exit /b 1
)

if not exist dist (
    echo ERROR: Build completed but dist folder not found
    pause
    exit /b 1
)

echo React build successful!
echo.

echo Testing Electron application...
npx electron electron/main.cjs
if errorlevel 1 (
    echo ERROR: Electron failed to start
    pause
    exit /b 1
)

echo.
echo Electron app started successfully!
echo You can now build the installer with: npx electron-builder
echo.
pause