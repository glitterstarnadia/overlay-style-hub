#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 Building Production Electron App...');
console.log('=====================================');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
['dist', 'dist-electron'].forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   Removing ${dir}...`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Step 2: Build React app for production
console.log('⚛️ Building optimized React app...');
try {
  process.env.NODE_ENV = 'production';
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ React build failed:', error.message);
  process.exit(1);
}

// Step 3: Verify build
if (!fs.existsSync('dist')) {
  console.error('❌ Build failed - dist folder not created');
  process.exit(1);
}

console.log('✅ React build completed successfully!');

// Step 4: Check file sizes
const getDirectorySize = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let size = 0;
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += fs.statSync(filePath).size;
    }
  });
  return size;
};

const distSize = (getDirectorySize('dist') / 1024 / 1024).toFixed(2);
console.log(`📊 Build size: ${distSize} MB`);

// Step 5: Build Electron distributables
console.log('📦 Building Electron distributables...');
console.log('   This may take several minutes...');

try {
  // Build for current platform first
  execSync('npx electron-builder --publish=never', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('');
  console.log('🎉 BUILD COMPLETED SUCCESSFULLY!');
  console.log('================================');
  console.log('📁 Your app files are in: dist-electron/');
  
  // List generated files
  if (fs.existsSync('dist-electron')) {
    const files = fs.readdirSync('dist-electron');
    console.log('📦 Generated files:');
    files.forEach(file => {
      const filePath = path.join('dist-electron', file);
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`   • ${file} (${sizeInMB} MB)`);
    });
  }
  
  console.log('');
  console.log('💰 Ready for distribution!');
  console.log('   Upload the installer files to sell your app');
  
} catch (error) {
  console.error('❌ Electron build failed:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('   1. Check that all dependencies are installed');
  console.log('   2. Verify the dist folder contains your React build');
  console.log('   3. Check electron-builder.json configuration');
  process.exit(1);
}