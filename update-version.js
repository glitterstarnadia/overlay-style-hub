#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function updateVersion(versionType = 'patch') {
  console.log('🔄 Updating version...');
  
  // Read package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  let version = packageJson.version || '1.0.0';
  let [major, minor, patch] = version.split('.').map(Number);
  
  // Update version based on type
  switch (versionType) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
    default:
      patch += 1;
      break;
  }
  
  const newVersion = `${major}.${minor}.${patch}`;
  
  console.log(`📊 Version: ${version} → ${newVersion}`);
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log('✅ Version updated successfully!');
  console.log(`🏷️  New version: v${newVersion}`);
  
  return newVersion;
}

// Check command line arguments
const versionType = process.argv[2] || 'patch';

if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: major, minor, or patch');
  process.exit(1);
}

updateVersion(versionType);