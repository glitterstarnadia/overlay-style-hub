// Preload script for Electron security
const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any electron-specific APIs here if needed
  platform: process.platform
});