// Auto-update checker for Electron app
export class UpdateChecker {
  private updateURL = 'https://your-domain.com/api/updates';
  private currentVersion: string;

  constructor() {
    this.currentVersion = '1.0.0'; // Will be replaced with actual version
  }

  async checkForUpdates(): Promise<{
    hasUpdate: boolean;
    latestVersion?: string;
    downloadUrl?: string;
    releaseNotes?: string;
  }> {
    try {
      const response = await fetch(`${this.updateURL}/latest`);
      const data = await response.json();
      
      const hasUpdate = this.isNewerVersion(data.version, this.currentVersion);
      
      return {
        hasUpdate,
        latestVersion: data.version,
        downloadUrl: data.downloadUrl,
        releaseNotes: data.releaseNotes
      };
    } catch (error) {
      console.error('Update check failed:', error);
      return { hasUpdate: false };
    }
  }

  private isNewerVersion(remote: string, local: string): boolean {
    const remoteV = remote.split('.').map(Number);
    const localV = local.split('.').map(Number);
    
    for (let i = 0; i < Math.max(remoteV.length, localV.length); i++) {
      const r = remoteV[i] || 0;
      const l = localV[i] || 0;
      
      if (r > l) return true;
      if (r < l) return false;
    }
    
    return false;
  }

  async downloadUpdate(url: string): Promise<void> {
    // In Electron, this would trigger the auto-updater
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      await (window as any).electronAPI.downloadUpdate(url);
    } else {
      // Fallback: open download in browser
      window.open(url, '_blank');
    }
  }
}