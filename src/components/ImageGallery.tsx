import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import hairMain from '@/assets/hair-main.jpg';
import hair1 from '@/assets/hair-1.jpg';
import hair2 from '@/assets/hair-2.jpg';
import hair3 from '@/assets/hair-3.jpg';
import hair4 from '@/assets/hair-4.jpg';

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
  selectedColor: string;
}

// Map the imported images
const imageMap: Record<string, string> = {
  '/src/assets/hair-main.jpg': hairMain,
  '/src/assets/hair-1.jpg': hair1,
  '/src/assets/hair-2.jpg': hair2,
  '/src/assets/hair-3.jpg': hair3,
  '/src/assets/hair-4.jpg': hair4,
};

interface ImageSettings {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  thumbnails,
  selectedColor,
}) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [imageSettings, setImageSettings] = useState<Record<string, ImageSettings>>({});

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const getImageSettings = (imageKey: string): ImageSettings => {
    return imageSettings[imageKey] || {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1.0
    };
  };

  const updateImageSettings = (imageKey: string, settings: Partial<ImageSettings>) => {
    setImageSettings(prev => ({
      ...prev,
      [imageKey]: { ...getImageSettings(imageKey), ...settings }
    }));
  };

  const saveImageSettings = (imageKey: string) => {
    const settings = getImageSettings(imageKey);
    // Here you could save to localStorage, database, etc.
    console.log('Saved settings for', imageKey, settings);
    toast({
      title: "✨ Settings Saved!",
      description: `Position, rotation, and scale saved for this image`,
    });
  };

  const clearImageSettings = (imageKey: string) => {
    const defaultSettings = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1.0
    };
    setImageSettings(prev => ({
      ...prev,
      [imageKey]: defaultSettings
    }));
    toast({
      title: "🔄 Settings Cleared!",
      description: `Reset to default values`,
    });
  };

  return (
    <div className="p-6 flex gap-6 h-full">
      {/* Main Image - Smaller */}
      <div className="flex-shrink-0">
        <div className="relative bg-gradient-to-br from-pink-50 via-purple-50/20 to-pink-100/30 rounded-xl p-4 shadow-lg border border-pink-200/40">
          <img
            src={imageMap[selectedImage] || selectedImage}
            alt="Main character view"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-pink-100/10 rounded-xl" />
        </div>
      </div>
      
      {/* Side Panel with Scrollable Thumbnails */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-pink-700 mb-4 flex items-center gap-2">
          <span>✨</span> Variations
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {thumbnails.map((thumbnail, index) => {
            const imageKey = thumbnail;
            const settings = getImageSettings(imageKey);
            
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-lg border border-pink-200/50 hover:border-pink-300 transition-all duration-300 hover:shadow-md cursor-pointer group"
              >
                {/* Thumbnail Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={imageMap[thumbnail] || thumbnail}
                    alt={`Variation ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md group-hover:scale-105 transition-transform duration-300 shadow-sm"
                  />
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
                
                {/* Controls */}
                <div className="flex-1 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Position Controls */}
                    <div>
                      <p className="font-medium text-pink-700 mb-1">Position</p>
                      <div className="space-y-1">
                       <div className="flex items-center gap-2">
                           <span className="text-xs text-pink-600 w-4">X:</span>
                           <input 
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                             value={settings.position.x}
                             onChange={(e) => updateImageSettings(imageKey, { 
                               position: { ...settings.position, x: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-pink-600 w-4">Y:</span>
                           <input 
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                             value={settings.position.y}
                             onChange={(e) => updateImageSettings(imageKey, { 
                               position: { ...settings.position, y: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-pink-600 w-4">Z:</span>
                           <input 
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                             value={settings.position.z}
                             onChange={(e) => updateImageSettings(imageKey, { 
                               position: { ...settings.position, z: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                      </div>
                    </div>
                    
                    {/* Rotate Controls */}
                    <div>
                      <p className="font-medium text-pink-700 mb-1">Rotate</p>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-pink-600 w-4">X:</span>
                           <input 
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                             value={settings.rotation.x}
                             onChange={(e) => updateImageSettings(imageKey, { 
                               rotation: { ...settings.rotation, x: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-pink-600 w-4">Y:</span>
                           <input 
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                             value={settings.rotation.y}
                             onChange={(e) => updateImageSettings(imageKey, { 
                               rotation: { ...settings.rotation, y: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-pink-600 w-4">Z:</span>
                           <input 
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                             value={settings.rotation.z}
                             onChange={(e) => updateImageSettings(imageKey, { 
                               rotation: { ...settings.rotation, z: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Scale Control */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-pink-700 mb-1">Scale</p>
                      <input 
                        className="w-16 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" 
                        value={settings.scale}
                        onChange={(e) => updateImageSettings(imageKey, { 
                          scale: parseFloat(e.target.value) || 1.0 
                        })}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveImageSettings(imageKey)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 text-xs"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => clearImageSettings(imageKey)}
                        className="border-pink-300 text-pink-600 hover:bg-pink-50 px-3 py-1 text-xs"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};