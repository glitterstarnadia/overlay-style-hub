#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

function release(versionType = 'patch') {
  console.log('🚀 Creating Release Build...');
  console.log('============================');
  
  try {
    // Step 1: Update version
    console.log(`📈 Updating version (${versionType})...`);
    execSync(`node update-version.js ${versionType}`, { stdio: 'inherit' });
    
    // Get new version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const newVersion = packageJson.version;
    
    console.log('');
    
    // Step 2: Build production app
    console.log('🔨 Building production app...');
    execSync('node build-production.js', { stdio: 'inherit' });
    
    console.log('');
    console.log('🎉 RELEASE BUILD COMPLETE!');
    console.log('==========================');
    console.log(`🏷️  Version: v${newVersion}`);
    console.log('📁 Files ready in: dist-electron/');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Test the installers');
    console.log('   2. Upload to your sales platform');
    console.log('   3. Announce the release!');
    console.log('');
    console.log('💰 Ready to sell! 🎯');
    
  } catch (error) {
    console.error('❌ Release build failed:', error.message);
    process.exit(1);
  }
}

// Get version type from command line
const versionType = process.argv[2] || 'patch';

if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('❌ Usage: node release.js [major|minor|patch]');
  console.error('   Examples:');
  console.error('     node release.js patch   # 1.0.0 → 1.0.1');
  console.error('     node release.js minor   # 1.0.0 → 1.1.0'); 
  console.error('     node release.js major   # 1.0.0 → 2.0.0');
  process.exit(1);
}

release(versionType);