import React, { useState, useEffect } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';

const FloatingMenuApp = () => {
  const [overlayVisible, setOverlayVisible] = useState(true);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  // Hide the overlay temporarily when not in use to show only when needed
  useEffect(() => {
    // Auto-show menu after 1 second for better UX
    const timer = setTimeout(() => {
      setOverlayVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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