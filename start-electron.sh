#!/bin/bash

echo "========================================"
echo "   Nadia <3 Electron Build Script"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if NPM is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: NPM is not installed or not in PATH"
    exit 1
fi

echo "Node.js and NPM are available"
echo

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo
fi

echo "Building React application..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: React build failed"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "ERROR: Build completed but dist folder not found"
    exit 1
fi

echo "React build successful!"
echo

echo "Testing Electron application..."
npx electron electron/main.cjs
if [ $? -ne 0 ]; then
    echo "ERROR: Electron failed to start"
    exit 1
fi

echo
echo "Electron app started successfully!"
echo "You can now build the installer with: npx electron-builder"
echo

# Make script executable
chmod +x start-electron.sh