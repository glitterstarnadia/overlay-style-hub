const RPC = require('discord-rpc');

// Discord Application ID (you'll need to create this on Discord Developer Portal)
const CLIENT_ID = '1234567890123456789'; // Replace with your actual Discord App ID

class DiscordRPC {
  constructor() {
    this.rpc = new RPC.Client({ transport: 'ipc' });
    this.connected = false;
    this.currentActivity = null;
  }

  async connect() {
    try {
      await this.rpc.login({ clientId: CLIENT_ID });
      this.connected = true;
      console.log('Discord RPC connected!');
      
      // Set initial presence
      this.setActivity({
        state: 'Customizing Styles',
        details: 'Using Overlay Style Hub',
        startTimestamp: Date.now(),
        largeImageKey: 'app-logo',
        largeImageText: 'Overlay Style Hub',
        smallImageKey: 'sparkles',
        smallImageText: 'Creating Magic ✨',
        buttons: [
          {
            label: 'Get Style Hub',
            url: 'https://your-website.com' // Replace with your app's website
          }
        ]
      });
    } catch (error) {
      console.log('Discord not detected or failed to connect:', error.message);
      this.connected = false;
    }
  }

  setActivity(activity) {
    if (!this.connected) return;
    
    try {
      this.currentActivity = activity;
      this.rpc.setActivity(activity);
      console.log('Discord activity updated:', activity.details);
    } catch (error) {
      console.log('Failed to update Discord activity:', error.message);
    }
  }

  updateDetails(details, state = null) {
    if (!this.connected || !this.currentActivity) return;

    const updatedActivity = {
      ...this.currentActivity,
      details: details,
      ...(state && { state: state })
    };
    
    this.setActivity(updatedActivity);
  }

  updateState(state) {
    if (!this.connected || !this.currentActivity) return;

    const updatedActivity = {
      ...this.currentActivity,
      state: state
    };
    
    this.setActivity(updatedActivity);
  }

  disconnect() {
    if (this.connected) {
      this.rpc.destroy();
      this.connected = false;
      console.log('Discord RPC disconnected');
    }
  }
}

module.exports = DiscordRPC;