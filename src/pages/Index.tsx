import React, { useState } from 'react';
import { CustomizationOverlay } from '@/components/CustomizationOverlay';

const Index = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-overlay-bg to-background">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Character Customizer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Create and customize your perfect avatar with our advanced character editor. 
            Choose from hairstyles, clothing, colors, and more to bring your character to life.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-overlay-surface/50 backdrop-blur-sm p-6 rounded-xl border border-overlay-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unlimited Styles</h3>
              <p className="text-muted-foreground text-sm">
                Mix and match from hundreds of hairstyles, outfits, and accessories
              </p>
            </div>
            
            <div className="bg-overlay-surface/50 backdrop-blur-sm p-6 rounded-xl border border-overlay-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Color Freedom</h3>
              <p className="text-muted-foreground text-sm">
                Use our advanced color picker to create any look you can imagine
              </p>
            </div>
            
            <div className="bg-overlay-surface/50 backdrop-blur-sm p-6 rounded-xl border border-overlay-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Preview</h3>
              <p className="text-muted-foreground text-sm">
                See changes instantly with our live customization overlay
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Customization Overlay */}
      <CustomizationOverlay 
        isVisible={overlayVisible} 
        onToggle={toggleOverlay} 
      />
    </div>
  );
};

export default Index;
