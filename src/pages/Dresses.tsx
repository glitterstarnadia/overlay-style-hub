import React, { useState } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';

const Dresses = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-overlay-bg to-background">
      {/* Customization Overlay */}
      <CustomizationOverlay 
        isVisible={overlayVisible} 
        onToggle={toggleOverlay} 
        defaultActiveSection="dresses"
        pageKey="dresses"
      />
    </div>
  );
};

export default Dresses;