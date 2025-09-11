#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Monthly release automation script
console.log('📅 Monthly Release Process');
console.log('==========================');

const date = new Date();
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = monthNames[date.getMonth()];
const year = date.getFullYear();

console.log(`🗓️  ${monthName} ${year} Release`);

// Get current version
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`📊 Current version: v${currentVersion}`);

// Determine version bump type
const args = process.argv.slice(2);
const bumpType = args[0] || 'minor'; // Default to minor for monthly releases

console.log(`📈 Bumping ${bumpType} version...`);

try {
  // Step 1: Create changelog entry
  console.log('📝 Updating changelog...');
  const changelogPath = path.join(__dirname, 'CHANGELOG.md');
  
  let changelog = '';
  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } else {
    changelog = '# Changelog\n\n';
  }

  // Get new version
  execSync(`node update-version.js ${bumpType}`, { stdio: 'pipe' });
  const newPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const newVersion = newPackageJson.version;

  // Add changelog entry
  const today = new Date().toISOString().split('T')[0];
  const newEntry = `## [${newVersion}] - ${today}\n\n### Added\n- Monthly feature updates\n- Performance improvements\n- Bug fixes\n\n### Changed\n- UI enhancements\n- Better user experience\n\n### Fixed\n- Various stability improvements\n\n`;
  
  changelog = changelog.replace('# Changelog\n\n', `# Changelog\n\n${newEntry}`);
  fs.writeFileSync(changelogPath, changelog);

  console.log(`✅ Changelog updated with v${newVersion}`);

  // Step 2: Build release
  console.log('🔨 Building release...');
  execSync('node build-production.js', { stdio: 'inherit' });

  // Step 3: Create release notes
  console.log('📋 Generating release notes...');
  const releaseNotes = {
    version: newVersion,
    date: today,
    title: `${monthName} ${year} Update`,
    features: [
      'Enhanced customization options',
      'Improved performance and stability',
      'New styling features',
      'Bug fixes and optimizations'
    ],
    downloadUrl: `https://your-domain.com/releases/nadia-${newVersion}.exe`,
    changelog: `https://your-domain.com/changelog#v${newVersion.replace(/\./g, '')}`
  };

  fs.writeFileSync(
    path.join('dist-electron', `release-notes-${newVersion}.json`),
    JSON.stringify(releaseNotes, null, 2)
  );

  // Step 4: Create update manifest
  console.log('📄 Creating update manifest...');
  const updateManifest = {
    version: newVersion,
    releaseDate: today,
    releaseNotes: `New ${monthName} update with enhanced features and improvements!`,
    downloads: {
      windows: `https://your-domain.com/releases/nadia-${newVersion}-win-x64.exe`,
      mac: `https://your-domain.com/releases/nadia-${newVersion}-mac.dmg`,
      linux: `https://your-domain.com/releases/nadia-${newVersion}-linux-x64.AppImage`
    },
    minVersion: '1.0.0',
    forceUpdate: false
  };

  fs.writeFileSync(
    path.join('dist-electron', 'latest.json'),
    JSON.stringify(updateManifest, null, 2)
  );

  console.log('');
  console.log('🎉 MONTHLY RELEASE COMPLETE!');
  console.log('=============================');
  console.log(`🏷️  Version: v${newVersion}`);
  console.log(`📅 Release: ${monthName} ${year}`);
  console.log('📁 Files ready in: dist-electron/');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('   1. Upload installers to your CDN/website');
  console.log('   2. Update your website with new version info');
  console.log('   3. Send update notifications to existing users');
  console.log('   4. Announce on social media');
  console.log('   5. Update app store listings');
  console.log('');
  console.log('📧 Auto-update users will be notified automatically!');

} catch (error) {
  console.error('❌ Monthly release failed:', error.message);
  process.exit(1);
}