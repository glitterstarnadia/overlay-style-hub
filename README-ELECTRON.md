# Electron Build Instructions

## Quick Start (Recommended)

### For Production Build:
```bash
node build-electron.js
```

### For Development:
```bash
node dev-electron.js
```

## Manual Build Process

### Step 1: Build React App
```bash
npm run build
```

### Step 2: Test Electron (Optional)
```bash
npx electron electron/main.cjs
```

### Step 3: Package Electron App
```bash
npx electron-builder
```

## Configuration Files

### ✅ vite.config.ts
- Server port: 8080 ✓
- Base path: './' for production ✓
- Relative asset paths ✓

### ✅ electron-builder.json
- App ID: com.nadia.app ✓
- Product Name: Nadia <3 ✓
- Files include: dist/** and electron/** ✓
- Output directory: dist-electron ✓

### ✅ electron/main.cjs
- Development server: http://localhost:8080 ✓
- Production paths: Multiple fallback paths ✓
- Error handling: Comprehensive logging ✓

### ✅ index.html
- Script path: Correct for build ✓
- Asset paths: Relative paths ✓

## Troubleshooting

### Issue: Blank Screen in Electron
1. Check if `dist` folder exists after build
2. Look for console errors in DevTools (opens automatically)
3. Verify all assets are using relative paths

### Issue: Build Fails
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist dist-electron`
3. Run build script with verbose output

### Issue: Images Not Loading
1. Ensure all image imports use ES6 syntax: `import image from '@/assets/image.jpg'`
2. Check that images exist in src/assets folder
3. Verify no absolute paths are used

## Scripts Created

- `build-electron.js` - Complete automated build process
- `dev-electron.js` - Development mode with hot reload
- `README-ELECTRON.md` - This documentation

## Development Flow

1. Run `node dev-electron.js` for development
2. Make changes to React code
3. Vite will hot-reload in Electron
4. When ready to build: `node build-electron.js`

## Production Flow

1. Run `node build-electron.js`
2. Find your app in `dist-electron` folder
3. Distribute the installer/app package