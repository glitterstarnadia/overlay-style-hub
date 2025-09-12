#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 Building Electron App...');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
if (fs.existsSync('dist-electron')) {
  fs.rmSync('dist-electron', { recursive: true, force: true });
}

// Step 2: Build React app
console.log('⚛️ Building React app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ React build failed:', error.message);
  process.exit(1);
}

// Step 3: Verify dist folder exists
if (!fs.existsSync('dist')) {
  console.error('❌ Dist folder not created. Build failed.');
  process.exit(1);
}

console.log('✅ React build successful!');

// Step 4: Build Electron app
console.log('📦 Building Electron app...');
try {
  execSync('npx electron-builder --config=electron-builder.json --publish=never --win --x64', { stdio: 'inherit' });
  console.log('✅ Electron app built successfully!');
  console.log('📁 Check the dist-electron folder for your app.');
} catch (error) {
  console.error('❌ Electron build failed:', error.message);
  
  // Try to run electron directly for testing
  console.log('🔄 Trying to run electron directly for testing...');
  try {
    execSync('npx electron electron/main.cjs', { stdio: 'inherit' });
  } catch (electronError) {
    console.error('❌ Direct electron run also failed:', electronError.message);
  }
}