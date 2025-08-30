import React, { useState, useEffect } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';
import { useDiscordRPC } from '@/hooks/useDiscordRPC';
import DebugInfo from '@/components/DebugInfo';

console.log('=== FLOATINGMENUAPP LOADING ===');

const FloatingMenuApp = () => {
  console.log('=== FLOATINGMENUAPP RENDERING ===');
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const { activities } = useDiscordRPC();

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  // Initialize Discord RPC
  useEffect(() => {
    console.log('=== FLOATINGMENUAPP USEEFFECT ===');
    // Set initial Discord activity
    activities.browsing();
    
    // Auto-show menu after 1 second for better UX
    const timer = setTimeout(() => {
      setOverlayVisible(true);
    }, 1000);

    // Hide debug info after 5 seconds
    const debugTimer = setTimeout(() => {
      setShowDebug(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(debugTimer);
    };
  }, [activities]);

  console.log('=== FLOATINGMENUAPP ABOUT TO RETURN JSX ===');

  return (
    <div 
      className="w-screen h-screen relative overflow-hidden"
      style={{ 
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
    >
      {/* Debug component to verify React is working */}
      {showDebug && <DebugInfo />}
      
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

console.log('=== FLOATINGMENUAPP DEFINED ===');

export default FloatingMenuApp;