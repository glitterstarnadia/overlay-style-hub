// Preload script for Electron security
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  
  // Discord RPC functions
  updateDiscordActivity: (details, state) => {
    return ipcRenderer.invoke('discord-update-activity', { details, state });
  },
  
  updateDiscordState: (state) => {
    return ipcRenderer.invoke('discord-update-state', state);
  },
  
  // Web bar visibility function
  setWebBarVisibility: (visible) => {
    return ipcRenderer.invoke('set-web-bar-visibility', visible);
  },
  
  // Window resize functions
  resizeWindow: (width, height) => {
    return ipcRenderer.invoke('resize-window', { width, height });
  },
  
  getWindowSize: () => {
    return ipcRenderer.invoke('get-window-size');
  }
});