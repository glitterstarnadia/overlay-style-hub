import React, { useState } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';

const Index = () => {
  const [overlayVisible, setOverlayVisible] = useState(true); // Always show overlay

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Customization Overlay - Always visible and floating */}
      <CustomizationOverlay 
        isVisible={overlayVisible} 
        onToggle={toggleOverlay} 
      />
    </div>
  );
};

export default Index;
