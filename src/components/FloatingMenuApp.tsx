import React, { useState, useEffect } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';
import { useDiscordRPC } from '@/hooks/useDiscordRPC';
import DebugInfo from '@/components/DebugInfo';

console.log('=== FLOATINGMENUAPP LOADING ===');

const FloatingMenuApp = () => {
  console.log('=== FLOATINGMENUAPP RENDERING ===');
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const [menuSize, setMenuSize] = useState({ width: 800, height: 600 });
  const [menuPosition, setMenuPosition] = useState({ x: 50, y: 50 });
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
      className="w-screen h-screen relative overflow-hidden transition-all duration-300"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      {/* Dynamic background content that adjusts to menu */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          filter: overlayVisible ? 'blur(1px) brightness(90%)' : 'none',
          transform: overlayVisible ? 'scale(0.98)' : 'scale(1)'
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-pink-300/30 to-purple-400/30"
            style={{
              clipPath: overlayVisible 
                ? `polygon(0% 0%, ${(menuPosition.x / window.innerWidth) * 100}% 0%, ${(menuPosition.x / window.innerWidth) * 100}% ${((menuPosition.y + menuSize.height) / window.innerHeight) * 100}%, 0% ${((menuPosition.y + menuSize.height) / window.innerHeight) * 100}%)`
                : 'none'
            }}
          />
        </div>
        
        {/* Responsive content areas */}
        <div className="h-full p-8 grid grid-cols-12 gap-4">
          {/* Left side content - adjusts when menu is present */}
          <div 
            className={`transition-all duration-300 ${
              overlayVisible 
                ? 'col-span-5 opacity-50' 
                : 'col-span-12 opacity-100'
            }`}
          >
            <div className="h-full flex flex-col justify-center items-center text-white">
              <h1 className="text-4xl font-bold mb-4 text-center">
                Style Hub Desktop
              </h1>
              <p className="text-lg text-center opacity-80">
                Customize your avatar with our floating menu
              </p>
            </div>
          </div>
          
          {/* Right side - shows info when menu is active */}
          {overlayVisible && (
            <div className="col-span-7 flex items-center justify-center">
              <div className="text-white/60 text-center">
                <p className="text-sm">
                  Menu Size: {menuSize.width} × {menuSize.height}
                </p>
                <p className="text-sm">
                  Position: ({menuPosition.x}, {menuPosition.y})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug component to verify React is working */}
      {showDebug && <DebugInfo />}
      
      {/* Floating menu */}
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

console.log('=== FLOATINGMENUAPP DEFINED ===');

export default FloatingMenuApp;