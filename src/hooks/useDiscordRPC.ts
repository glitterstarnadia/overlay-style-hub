import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    electronAPI?: {
      updateDiscordActivity: (details: string, state: string) => Promise<void>;
      updateDiscordState: (state: string) => Promise<void>;
    };
  }
}

export const useDiscordRPC = () => {
  const updateActivity = useCallback(async (details: string, state?: string) => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.updateDiscordActivity(details, state || 'Styling');
      } catch (error) {
        console.log('Discord RPC not available');
      }
    }
  }, []);

  const updateState = useCallback(async (state: string) => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.updateDiscordState(state);
      } catch (error) {
        console.log('Discord RPC not available');
      }
    }
  }, []);

  // Activity presets for different sections
  const activities = {
    hair: () => updateActivity('Customizing Hair Styles', 'Choosing the perfect look ✨'),
    patterns: () => updateActivity('Designing Patterns', 'Creating beautiful designs 🎨'),
    colors: () => updateActivity('Mixing Colors', 'Finding the perfect palette 🌈'),
    profiles: () => updateActivity('Managing Profiles', 'Organizing style collections 📁'),
    editing: () => updateActivity('Editing Configuration', 'Fine-tuning the details ⚙️'),
    browsing: () => updateActivity('Browsing Styles', 'Exploring options 👀')
  };

  return {
    updateActivity,
    updateState,
    activities
  };
};