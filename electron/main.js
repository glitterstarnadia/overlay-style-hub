const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DiscordRPC = require('./discord-rpc');

const isDev = process.env.NODE_ENV === 'development';
let discordRPC = null;

function createWindow() {
  // Create the browser window with transparency and no frame
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false, // Remove window frame for clean look
    transparent: true, // Enable transparency
    alwaysOnTop: true, // Keep on top like an overlay
    resizable: true,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true, // Don't show in taskbar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
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