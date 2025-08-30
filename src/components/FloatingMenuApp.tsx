import React, { useState, useEffect } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';
import { useDiscordRPC } from '@/hooks/useDiscordRPC';

const FloatingMenuApp = () => {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const { activities } = useDiscordRPC();

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  // Initialize Discord RPC
  useEffect(() => {
    // Set initial Discord activity
    activities.browsing();
    
    // Auto-show menu after 1 second for better UX
    const timer = setTimeout(() => {
      setOverlayVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activities]);

  return (
    <div 
      className="w-screen h-screen relative overflow-hidden"
      style={{ 
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
    >
      {/* Only the floating menu, no other content */}
      <CustomizationOverlay 
        isVisible={overlayVisible} 
        onToggle={toggleOverlay} 
      />
      
      {/* Invisible toggle button for easy access when menu is hidden */}
      {!overlayVisible && (
        <button
          onClick={toggleOverlay}
          className="fixed top-4 left-4 w-4 h-4 bg-pink-400 rounded-full opacity-30 hover:opacity-70 transition-opacity z-50"
          title="Show Menu"
        />
      )}
    </div>
  );
};

export default FloatingMenuApp;