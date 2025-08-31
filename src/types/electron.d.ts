// Type definitions for Electron APIs exposed through preload script

interface ElectronAPI {
  platform: string;
  
  // Discord RPC functions
  updateDiscordActivity: (details: string, state: string) => Promise<void>;
  updateDiscordState: (state: string) => Promise<void>;
  
  // Web bar visibility function
  setWebBarVisibility: (visible: boolean) => Promise<void>;
  
  // Window resize functions
  resizeWindow: (width: number, height: number) => Promise<void>;
  getWindowSize: () => Promise<[number, number]>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};