import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Upload, Camera, ChevronUp, ChevronDown, Edit2, Plus, Check, X, Heart, User, ImageIcon } from 'lucide-react';
import ColoursPinkBox from './ColoursPinkBox';
import GlitterBorder from './GlitterBorder';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { processImageFile, createHighQualityThumbnail } from '@/utils/imageProcessing';
import hairMain from '@/assets/hair-main.jpg';
import hair1 from '@/assets/hair-1.jpg';
import hair2 from '@/assets/hair-2.jpg';
import hair3 from '@/assets/hair-3.jpg';
import hair4 from '@/assets/hair-4.jpg';

/* Custom Scrollbar Styles */
const scrollbarStyles = `
  .custom-scrollbar-main::-webkit-scrollbar {
    width: 12px;
  }
  .custom-scrollbar-main::-webkit-scrollbar-track {
    background: rgba(219, 188, 255, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar-main::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ec4899, #8b5cf6);
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  .custom-scrollbar-main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #db2777, #7c3aed);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(219, 188, 255, 0.2);
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(236, 72, 153, 0.6);
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(236, 72, 153, 0.8);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
  selectedColor: string;
  category?: string;
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
  scale: string | number;
  scaleHex?: string;
  hexColor1?: string;
  hexColor2?: string;
  hexColor3?: string;
  hexColor4?: string;
  hexColor5?: string;
  hexColor6?: string;
  notes?: string;
}

interface SavedProfile {
  id: string;
  name: string;
  thumbnail: string;
  mainImage: string;
  settings: Record<string, ImageSettings>;
  transformImages: Record<string, string>;
  transformImages2?: Record<string, string>;
  transformControls: string[];
  smallerImage: string;
  createdAt: Date;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  thumbnails,
  selectedColor,
  category = 'default',
}) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSettings, setImageSettings] = useState<Record<string, ImageSettings>>({});
  const [currentMainImage, setCurrentMainImage] = useState('');
  const [currentThumbnails, setCurrentThumbnails] = useState<string[]>([]);
  const [smallerImage, setSmallerImage] = useState('');
  const [transformControls, setTransformControls] = useState<string[]>(['default']);
  const [transformImages, setTransformImages] = useState<Record<string, string>>({});
  const [transformImages2, setTransformImages2] = useState<Record<string, string>>({});
  
  // Load saved profiles from localStorage on component mount
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(() => {
    const saved = localStorage.getItem(`saved-profiles-${category}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const smallerImageInputRef = useRef<HTMLInputElement>(null);
  const transformImageInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const transformImage2InputRefs = useRef<Record<string, HTMLInputElement>>({});
  const thumbnailInputRefs = useRef<Record<number, HTMLInputElement>>({});
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleImageUpload = async (file: File, isMain: boolean = false, isSmaller: boolean = false, thumbnailIndex?: number, transformId?: string, isSecond: boolean = false) => {
    if (file && file.type.startsWith('image/')) {
      try {
        toast({
          title: "🔄 Processing Image...",
          description: "Enhancing image quality, please wait",
        });

        // Process image with high quality settings
        const processedImageUrl = await processImageFile(file);
        
        if (isMain) {
          setCurrentMainImage(processedImageUrl);
          setSelectedImage(processedImageUrl);
          toast({
            title: "📸 Main Image Updated!",
            description: "High-quality main image has been loaded",
          });
        } else if (isSmaller) {
          setSmallerImage(processedImageUrl);
          toast({
            title: "🖼️ Smaller Image Updated!",
            description: "High-quality smaller image has been loaded",
          });
        } else if (transformId) {
          if (isSecond) {
            setTransformImages2(prev => ({
              ...prev,
              [transformId]: processedImageUrl
            }));
            toast({
              title: "🖼️ Second Transform Image Updated!",
              description: "High-quality second transform control image has been loaded",
            });
          } else {
            setTransformImages(prev => ({
              ...prev,
              [transformId]: processedImageUrl
            }));
            toast({
              title: "🖼️ Transform Image Updated!",
              description: "High-quality transform control image has been loaded",
            });
          }
        } else if (thumbnailIndex !== undefined) {
          const newThumbnails = [...currentThumbnails];
          newThumbnails[thumbnailIndex] = processedImageUrl;
          setCurrentThumbnails(newThumbnails);
          toast({
            title: "🖼️ Thumbnail Updated!",
            description: `High-quality thumbnail ${thumbnailIndex + 1} has been updated`,
          });
        }
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "❌ Image Processing Failed",
          description: error instanceof Error ? error.message : "Failed to process image",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "❌ Invalid File",
        description: "Please select a valid image file",
        variant: "destructive",
      });
    }
  };

  const triggerMainImageUpload = () => {
    mainImageInputRef.current?.click();
  };

  const triggerSmallerImageUpload = () => {
    smallerImageInputRef.current?.click();
  };

  const triggerTransformImageUpload = (transformId: string) => {
    transformImageInputRefs.current[transformId]?.click();
  };

  const triggerTransformImage2Upload = (transformId: string) => {
    transformImage2InputRefs.current[transformId]?.click();
  };

  const triggerThumbnailUpload = (index: number) => {
    thumbnailInputRefs.current[index]?.click();
  };
  
  const getImageSettings = (imageKey: string): ImageSettings => {
    return imageSettings[imageKey] || {
      position: { x: 0.50, y: 0.50, z: 0.50 },
      rotation: { x: 0.50, y: 0.50, z: 0.50 },
      scale: 0.50,
      scaleHex: '#ffffff',
      hexColor1: '#ffffff',
      hexColor2: '#ffffff',
      hexColor3: '#ffffff',
      hexColor4: '#ffffff',
      hexColor5: '#ffffff',
      hexColor6: '#ffffff',
      notes: ''
    };
  };

  const updateImageSettings = (imageKey: string, settings: Partial<ImageSettings>) => {
    setImageSettings(prev => ({
      ...prev,
      [imageKey]: { ...getImageSettings(imageKey), ...settings }
    }));
  };

  const clearImageSettings = (imageKey: string) => {
    const defaultSettings = {
      position: { x: 0.50, y: 0.50, z: 0.50 },
      rotation: { x: 0.50, y: 0.50, z: 0.50 },
      scale: 0.50,
      scaleHex: '#ffffff',
      hexColor1: '#ffffff',
      hexColor2: '#ffffff',
      hexColor3: '#ffffff',
      hexColor4: '#ffffff',
      hexColor5: '#ffffff',
      hexColor6: '#ffffff',
      notes: ''
    };
    setImageSettings(prev => ({
      ...prev,
      [imageKey]: defaultSettings
    }));
    toast({
      title: "🧹 Settings Cleared!",
      description: "All settings have been reset to defaults",
    });
  };

  const copyToClipboard = (value: string | number, label: string) => {
    navigator.clipboard.writeText(value.toString());
    toast({
      title: "📋 Copied!",
      description: `${label}: ${value} copied to clipboard`,
    });
  };

  const addTransformControl = () => {
    const newId = `transform-${Date.now()}`;
    setTransformControls(prev => [...prev, newId]);
    setTransformImages(prev => ({
      ...prev,
      [newId]: ''
    }));
    setTransformImages2(prev => ({
      ...prev,
      [newId]: ''
    }));
    toast({
      title: "➕ Control Added!",
      description: "New transform control set created with image upload",
    });
  };

  const removeTransformControl = (controlId: string) => {
    if (transformControls.length <= 1) {
      toast({
        title: "❌ Cannot Remove",
        description: "At least one set is required",
        variant: "destructive",
      });
      return;
    }

    setTransformControls(prev => prev.filter(id => id !== controlId));
    setTransformImages(prev => {
      const newImages = { ...prev };
      delete newImages[controlId];
      return newImages;
    });
    setTransformImages2(prev => {
      const newImages = { ...prev };
      delete newImages[controlId];
      return newImages;
    });
    toast({
      title: "🗑️ Set Removed!",
      description: "Transform control set deleted",
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Hidden file inputs */}
      {transformControls.map((controlId) => (
        <input
          key={`transform-${controlId}`}
          ref={(el) => {
            if (el) transformImageInputRefs.current[controlId] = el;
          }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, false, false, undefined, controlId);
          }}
        />
      ))}

      {/* Transform Controls Section for Colours (always show) or Main Image Display for other categories */}
      {category === 'colours' || currentMainImage ? (
        <div className="bg-overlay-surface rounded-xl p-4 shadow-panel border border-overlay-border max-h-[600px] overflow-y-auto custom-scrollbar">
          <h3 className="text-base font-bold theme-title-primary mb-2 flex items-center gap-2">
            <span>🎨</span> {category === 'colours' ? 'Colours & Patterns' : 'Profile'}
          </h3>
          
          {category !== 'colours' && currentMainImage && (
            <div className="flex gap-1">
              {/* Main Image Display */}
              <div className="flex-shrink-0">
                <img
                  src={imageMap[currentMainImage] || currentMainImage}
                  alt="Main image"
                  className="w-32 h-32 object-cover rounded-lg shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              </div>
              
              {/* Transform Controls */}
              <div className="flex-1 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {transformControls.map((controlId, index) => {
                  const imageKey = `${smallerImage || 'smaller-image-default'}-${controlId}`;
                  const settings = getImageSettings(imageKey);
                  
                  return (
                    <div key={controlId} className="p-0.5 bg-overlay-surface rounded-lg border border-overlay-border">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {transformImages[controlId] ? (
                              <img
                                src={imageMap[transformImages[controlId]] || transformImages[controlId]}
                                alt={`Transform image ${index + 1}`}
                                className="w-28 h-28 object-cover rounded shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                              />
                            ) : (
                              <div className="theme-placeholder-bg w-28 h-28 rounded shadow-md flex items-center justify-center border border-dashed border-overlay-border">
                                <Upload className="w-7 h-7 theme-icon-primary" />
                              </div>
                            )}
                            <Button
                              onClick={() => triggerTransformImageUpload(controlId)}
                              className="absolute -top-1 -right-1 text-primary-foreground p-0.5 rounded-full shadow-lg backdrop-blur-sm z-20 bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              <Upload className="w-2 h-2" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold theme-text-primary mb-1 flex items-center justify-between">
                            <span>Set {index + 1}</span>
                            <Button
                              onClick={() => removeTransformControl(controlId)}
                              className="w-3 h-3 text-primary-foreground rounded-full p-0 hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              <X className="w-1.5 h-1.5" />
                            </Button>
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Transform Controls for Colours (full width) */}
          {category === 'colours' && (
            <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {transformControls.map((controlId, index) => {
                const imageKey = `${smallerImage || 'smaller-image-default'}-${controlId}`;
                const settings = getImageSettings(imageKey);
                
                return (
                  <ColoursPinkBox
                    key={controlId}
                    controlId={controlId}
                    index={index}
                    imageKey={imageKey}
                    settings={settings}
                    transformImages={transformImages}
                    imageMap={imageMap}
                    onUpdateSettings={updateImageSettings}
                    onClearSettings={clearImageSettings}
                    onRemoveControl={removeTransformControl}
                    onUploadImage={triggerTransformImageUpload}
                    onCopyToClipboard={copyToClipboard}
                  />
                );
              })}
            </div>
          )}
          
          {/* Add Transform Control Button */}
          <div className="mt-2 flex justify-center">
            <Button
              onClick={addTransformControl}
              className="text-primary-foreground px-3 py-1 text-xs font-bold bg-primary hover:bg-primary/90"
            >
              <Plus className="w-3 h-3 text-primary-foreground mr-1" /> Add
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageGallery;
