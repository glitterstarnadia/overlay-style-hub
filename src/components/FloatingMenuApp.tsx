import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CustomizationOverlay from '@/components/CustomizationOverlay';
import { useDiscordRPC } from '@/hooks/useDiscordRPC';
import DebugInfo from '@/components/DebugInfo';

const FloatingMenuApp = () => {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const [menuSize, setMenuSize] = useState({ width: 800, height: 600 });
  const [menuPosition, setMenuPosition] = useState({ x: 50, y: 50 });
  const { activities } = useDiscordRPC();

  const toggleOverlay = useCallback(() => {
    setOverlayVisible(prev => !prev);
  }, []);

  // Initialize Discord RPC - remove activities dependency to prevent re-renders
  useEffect(() => {
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
  }, []); // Remove activities dependency to prevent re-renders

  const memoizedMenuSize = useMemo(() => menuSize, [menuSize]);
  const memoizedMenuPosition = useMemo(() => menuPosition, [menuPosition]);

  return (
    <div 
      className="w-screen h-screen relative overflow-hidden transition-all duration-300"
      style={{ 
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
    >
      {/* Dynamic background content that adjusts to menu - now invisible */}
      <div 
        className="absolute inset-0 transition-all duration-300 pointer-events-none"
        style={{
          filter: 'none',
          transform: 'none',
          opacity: 0
        }}
      >
        {/* Background pattern - hidden but kept for potential future use */}
        <div className="absolute inset-0 opacity-0">
          <div 
            className="absolute inset-0"
            style={{ display: 'none' }}
          />
        </div>
        
        {/* Responsive content areas - hidden */}
        <div className="h-full p-8 grid grid-cols-12 gap-4 opacity-0">
          {/* Content hidden for floating effect */}
        </div>
      </div>

      {/* Debug component to verify React is working */}
      {showDebug && <DebugInfo />}
      
      {/* Only the floating menu is visible */}
      <CustomizationOverlay
        isVisible={overlayVisible} 
        onToggle={toggleOverlay}
        onSizeChange={setMenuSize}
        onPositionChange={setMenuPosition}
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