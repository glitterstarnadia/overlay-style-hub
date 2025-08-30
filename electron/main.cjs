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
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Always open DevTools to debug blank screen
  mainWindow.webContents.openDevTools();

  // Add error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM is ready');
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
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (discordRPC) {
    discordRPC.disconnect();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
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