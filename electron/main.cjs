const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DiscordRPC = require('./discord-rpc.cjs');

const isDev = process.env.NODE_ENV === 'development';
let discordRPC = null;

function createWindow() {
  // Create the browser window as a floating app
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 900,
    frame: false, // Remove window frame for floating look
    transparent: true, // Enable transparency
    alwaysOnTop: true, // Keep on top for floating effect
    resizable: true,
    minimizable: false,
    maximizable: false,
    skipTaskbar: false, // Show in taskbar
    autoHideMenuBar: true, // Auto-hide menu bar
    roundedCorners: true, // Rounded corners if supported
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

  // Only open DevTools in development
  if (isDev) {
    setTimeout(() => {
      mainWindow.webContents.openDevTools();
    }, 1000);
  }

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

  // Enhanced always-on-top behavior
  mainWindow.setAlwaysOnTop(true, 'floating');
  
  // Force window to stay on top when it loses focus
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(false);
      mainWindow.setAlwaysOnTop(true, 'floating');
      mainWindow.focus();
    }
  });

  // Keep window on top when other windows are created
  mainWindow.on('show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(true, 'floating');
      mainWindow.focus();
    }
  });

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

// IPC handler for web bar visibility
ipcMain.handle('set-web-bar-visibility', (event, visible) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (visible) {
      // Show web bar (add frame)
      focusedWindow.setMenuBarVisibility(true);
    } else {
      // Hide web bar (remove frame)
      focusedWindow.setMenuBarVisibility(false);
    }
  }
});


// IPC handler for window resizing
ipcMain.handle('resize-window', (event, { width, height }) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.setSize(width, height, true);
  }
});

// IPC handler for getting current window size
ipcMain.handle('get-window-size', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    return focusedWindow.getSize();
  }
  return [800, 900];
});

// IPC handler for downloading updates
ipcMain.handle('download-update', (event, url) => {
  // Open the download URL in the default browser
  const { shell } = require('electron');
  shell.openExternal(url);
  return { success: true };
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