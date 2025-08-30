/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      updateDiscordActivity: (details: string, state: string) => Promise<void>;
      updateDiscordState: (state: string) => Promise<void>;
      setWebBarVisibility?: (visible: boolean) => Promise<void>;
    };
  }
}

export {};
