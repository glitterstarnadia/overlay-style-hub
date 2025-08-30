const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DiscordRPC = require('./discord-rpc.cjs');

const isDev = process.env.NODE_ENV === 'development';
let discordRPC = null;

function createWindow() {
  // Create the browser window as a normal desktop app
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 900,
    frame: true, // Show window frame 
    transparent: false, // Disable transparency
    alwaysOnTop: false, // Don't keep on top
    resizable: true,
    minimizable: true,
    maximizable: true,
    skipTaskbar: false, // Show in taskbar
    autoHideMenuBar: true, // Auto-hide menu bar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Load the app with better error handling
  const htmlPath = path.join(__dirname, '../dist/index.html');
  console.log('=== ELECTRON DEBUG INFO ===');
  console.log('Electron __dirname:', __dirname);
  console.log('Trying to load HTML from:', htmlPath);
  console.log('HTML file exists:', require('fs').existsSync(htmlPath));
  console.log('isDev:', isDev);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  if (isDev) {
    console.log('Loading dev server...');
    mainWindow.loadURL('http://localhost:8080');
  } else {
    console.log('Loading production file...');
    
    // Multiple possible paths for packaged app
    const paths = [
      path.join(__dirname, '../dist/index.html'),
      path.join(__dirname, '../app.asar.unpacked/dist/index.html'),
      path.join(process.resourcesPath, 'app/dist/index.html'),
      path.join(process.resourcesPath, 'dist/index.html')
    ];
    
    let loaded = false;
    for (const htmlPath of paths) {
      console.log('Trying path:', htmlPath, 'exists:', require('fs').existsSync(htmlPath));
      if (require('fs').existsSync(htmlPath)) {
        console.log('Loading from:', htmlPath);
        mainWindow.loadFile(htmlPath);
        loaded = true;
        break;
      }
    }
    
    if (!loaded) {
      console.error('NO HTML FILE FOUND IN ANY LOCATION!');
      mainWindow.loadURL(`data:text/html,<html><body><h1>Build Error</h1><p>Run: npm run build</p><p>Then: electron-builder</p></body></html>`);
    }
  }

  // Force DevTools to open in all cases for debugging
  setTimeout(() => {
    mainWindow.webContents.openDevTools();
  }, 1000);

  // Add comprehensive error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.log('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM is ready, isDev:', isDev);
    console.log('Current URL:', mainWindow.webContents.getURL());
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
    console.log('Final URL:', mainWindow.webContents.getURL());
  });

  // Make window draggable
  mainWindow.setMovable(true);
  
  // Hide menu bar
  mainWindow.setMenuBarVisibility(false);

  // Initialize Discord RPC
  discordRPC = new DiscordRPC();
  discordRPC.connect();

  return mainWindow;
}

// Handle Discord RPC events from renderer process
ipcMain.handle('discord-update-activity', (event, activityData) => {
  if (discordRPC) {
    discordRPC.updateDetails(activityData.details, activityData.state);
  }
});

ipcMain.handle('discord-update-state', (event, state) => {
  if (discordRPC) {
    discordRPC.updateState(state);
  }
});

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log('=== ELECTRON APP READY ===');
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  console.log('=== ALL WINDOWS CLOSED ===');
  if (discordRPC) {
    discordRPC.disconnect();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('=== APP ACTIVATED ===');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Prevent navigation away from the app
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent) => {
    navigationEvent.preventDefault();
  });
});