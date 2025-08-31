// Global type definitions for the application

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      updateDiscordActivity: (details: string, state: string) => Promise<void>;
      updateDiscordState: (state: string) => Promise<void>;
      setWebBarVisibility: (visible: boolean) => Promise<void>;
      resizeWindow: (width: number, height: number) => Promise<void>;
      getWindowSize: () => Promise<[number, number]>;
    };
  }
}

export {};