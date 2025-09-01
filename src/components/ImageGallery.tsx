import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Upload, Camera, ChevronUp, ChevronDown, Edit2, Plus, Check, X, Heart, User } from 'lucide-react';
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
  category?: string; // Add category prop to identify which section this is for
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
  category = 'default', // Default category if not provided
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

  const handleScaleChange = (imageKey: string, value: string) => {
    // Allow any input format - no validation restrictions
    updateImageSettings(imageKey, { scale: value });
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

  const addTransformControl = () => {
    const newId = `transform-${Date.now()}`;
    setTransformControls(prev => [...prev, newId]);
    // Initialize empty transform image for the new control
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
    // Don't allow removing the last set
    if (transformControls.length <= 1) {
      toast({
        title: "❌ Cannot Remove",
        description: "At least one set is required",
        variant: "destructive",
      });
      return;
    }

    setTransformControls(prev => prev.filter(id => id !== controlId));
    // Clean up transform image for the removed control
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

  const saveProfile = () => {
    if (!currentMainImage) {
      toast({
        title: "❌ No Main Image",
        description: "Please upload a main image first",
        variant: "destructive",
      });
      return;
    }

    if (activeProfileId) {
      // Overwrite existing profile
      setSavedProfiles(prev => prev.map(profile => 
        profile.id === activeProfileId 
          ? {
              ...profile,
              thumbnail: currentMainImage,
              mainImage: currentMainImage,
              settings: { ...imageSettings },
              transformImages: { ...transformImages },
              transformImages2: { ...transformImages2 },
              transformControls: [...transformControls],
              smallerImage: smallerImage,
            }
          : profile
      ));
      toast({
        title: "✨ Profile Updated!",
        description: "Your changes have been saved to the existing profile",
      });
    } else {
      // Create new profile
      const newProfile: SavedProfile = {
        id: `profile-${Date.now()}`,
        name: `Profile ${savedProfiles.length + 1}`,
        thumbnail: currentMainImage,
        mainImage: currentMainImage,
        settings: { ...imageSettings },
        transformImages: { ...transformImages },
        transformImages2: { ...transformImages2 },
        transformControls: [...transformControls],
        smallerImage: smallerImage,
        createdAt: new Date(),
      };

      setSavedProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
      toast({
        title: "✨ Profile Saved!",
        description: "Your image configuration has been saved",
      });
    }
  };

  const loadProfile = (profile: SavedProfile) => {
    setCurrentMainImage(profile.mainImage);
    setSelectedImage(profile.mainImage);
    setImageSettings(profile.settings);
    setTransformImages(profile.transformImages);
    setTransformImages2(profile.transformImages2 || {});
    setTransformControls(profile.transformControls || ['default']);
    setSmallerImage(profile.smallerImage);
    setActiveProfileId(profile.id);
    toast({
      title: "📁 Profile Loaded!",
      description: `Loaded configuration for ${profile.name}`,
    });
  };

  const deleteProfile = (profileId: string) => {
    setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
    }
    toast({
      title: "🗑️ Profile Deleted!",
      description: "Profile has been removed",
    });
  };

  const newProfile = () => {
    setCurrentMainImage('');
    setSelectedImage('');
    setImageSettings({});
    setTransformImages({});
    setTransformImages2({});
    setTransformControls(['default']);
    setSmallerImage('');
    setActiveProfileId(null);
    setCurrentThumbnails([]);
    toast({
      title: "✨ New Profile Started!",
      description: "Please upload a main image to get started",
    });
    // Automatically trigger main image upload
    setTimeout(() => {
      triggerMainImageUpload();
    }, 100);
  };

  const moveProfile = (profileId: string, direction: 'up' | 'down') => {
    setSavedProfiles(prev => {
      const currentIndex = prev.findIndex(p => p.id === profileId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newProfiles = [...prev];
      [newProfiles[currentIndex], newProfiles[newIndex]] = [newProfiles[newIndex], newProfiles[currentIndex]];
      return newProfiles;
    });
  };

  const startEditingName = (profile: SavedProfile) => {
    setEditingProfileId(profile.id);
    setEditingName(profile.name);
  };

  const saveProfileName = () => {
    if (!editingProfileId || !editingName.trim()) return;
    
    setSavedProfiles(prev => prev.map(profile => 
      profile.id === editingProfileId 
        ? { ...profile, name: editingName.trim() }
        : profile
    ));
    
    setEditingProfileId(null);
    setEditingName('');
    toast({
      title: "✏️ Name Updated!",
      description: "Profile name has been changed",
    });
  };

  const cancelEditingName = () => {
    setEditingProfileId(null);
    setEditingName('');
  };

  const copyToClipboard = (value: string | number, label: string) => {
    navigator.clipboard.writeText(value.toString());
    toast({
      title: "📋 Copied!",
      description: `${label}: ${value} copied to clipboard`,
    });
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
      title: "🔄 Settings Cleared!",
      description: `Reset to default values`,
    });
  };

  // Save profiles to localStorage whenever savedProfiles changes
  React.useEffect(() => {
    try {
      const profilesData = JSON.stringify(savedProfiles);
      localStorage.setItem(`saved-profiles-${category}`, profilesData);
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // QuotaExceededError - storage is full
        try {
          // Try to free up space by keeping only the 3 most recent profiles
          const reducedProfiles = savedProfiles.slice(-3);
          localStorage.setItem(`saved-profiles-${category}`, JSON.stringify(reducedProfiles));
          setSavedProfiles(reducedProfiles);
          
          toast({
            title: "💾 Storage Full",
            description: "Kept only 3 most recent profiles. Consider using smaller images or fewer profiles.",
          });
        } catch (secondError) {
          // If it still fails, clear all profiles
          localStorage.removeItem(`saved-profiles-${category}`);
          setSavedProfiles([]);
          
          toast({
            title: "❌ Storage Error",
            description: "Had to clear all profiles due to storage limitations. Try using smaller images.",
          });
        }
      } else {
        console.error("Error saving profiles:", error);
        toast({
          title: "❌ Save Error",
          description: "Failed to save profiles. Please try again.",
        });
      }
    }
  }, [savedProfiles, category]);

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto max-h-screen custom-scrollbar-main">
      
      {/* Saved Profiles Section */}
      <div className="bg-overlay-surface rounded-xl p-4 shadow-panel border border-overlay-border max-h-96 overflow-y-auto custom-scrollbar" style={{
        backgroundColor: 'hsl(var(--overlay-surface))',
        borderColor: 'hsl(var(--overlay-border))',
        boxShadow: 'var(--shadow-panel)'
      }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold theme-title-primary flex items-center gap-2">
            <span>📁</span> Saved Profiles
          </h3>
           <div className="flex gap-2">
             <Button
               onClick={newProfile}
               variant="ghost"
               size="sm"
               className="relative overflow-hidden text-primary-foreground hover:text-primary-foreground font-bold text-xs px-3 py-1 drop-shadow-md transform hover:scale-105 transition-all duration-200 shadow-3d-button gradient-cycle"
               style={{
                 background: 'var(--gradient-primary)',
                 backgroundSize: '400% 400%',
                 boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)'
               }}
             >
              <Plus className="w-3 h-3 mr-1 text-primary-foreground drop-shadow-sm" />
              New Profile
            </Button>
             <Button
               onClick={saveProfile}
               variant="ghost"
               size="sm"
               className="relative overflow-hidden text-primary-foreground hover:text-primary-foreground font-bold text-xs px-3 py-1 drop-shadow-md transform hover:scale-105 transition-all duration-200 shadow-3d-button gradient-cycle"
               style={{
                 background: 'var(--gradient-primary)',
                 backgroundSize: '400% 400%',
                 boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)'
               }}
             >
               {activeProfileId ? (
                 <User className="w-3 h-3 mr-1 text-primary-foreground drop-shadow-sm" />
               ) : (
                 <Save className="w-3 h-3 mr-1 text-primary-foreground drop-shadow-sm" />
               )}
              {activeProfileId ? 'Update Profile' : 'Save Profile'}
            </Button>
          </div>
        </div>
        
        {savedProfiles.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 px-3">
            {savedProfiles.map((profile, index) => (
              <div key={profile.id} className="flex-shrink-0 relative group p-2">
                <div 
                   className={cn(
                     "w-28 h-28 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:scale-110",
                     activeProfileId === profile.id 
                       ? "border-primary ring-2 ring-primary/30" 
                       : "border-overlay-border hover:border-primary"
                   )}
                   style={{
                     borderColor: activeProfileId === profile.id 
                       ? 'hsl(var(--primary))' 
                       : 'hsl(var(--overlay-border))'
                   }}
                  onClick={() => loadProfile(profile)}
                >
                <img
                  src={imageMap[profile.thumbnail] || profile.thumbnail}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  style={{ 
                    imageRendering: 'auto', 
                    maxWidth: 'none',
                    filter: 'contrast(1.05) saturate(1.1) brightness(1.02)'
                  }}
                />
                </div>
                
                {/* Profile Name - Editable */}
                {editingProfileId === profile.id ? (
                  <div className="mt-1 flex items-center gap-1">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                       className="w-16 px-1 py-0.5 text-xs rounded border border-overlay-border bg-overlay-surface focus:border-primary focus:outline-none text-foreground font-bold"
                       style={{
                         backgroundColor: 'hsl(var(--overlay-surface))',
                         borderColor: 'hsl(var(--overlay-border))',
                         color: 'hsl(var(--foreground))'
                       }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveProfileName();
                        if (e.key === 'Escape') cancelEditingName();
                      }}
                      autoFocus
                    />
                     <Button
                       onClick={saveProfileName}
                       className="w-3 h-3 text-primary-foreground rounded-full p-0"
                       style={{ backgroundColor: 'hsl(var(--primary))' }}
                       size="sm"
                     >
                       <Check className="w-2 h-2" />
                     </Button>
                     <Button
                       onClick={cancelEditingName}
                       className="w-3 h-3 text-primary-foreground rounded-full p-0"
                       style={{ backgroundColor: 'hsl(var(--primary))' }}
                       size="sm"
                     >
                       <X className="w-2 h-2" />
                     </Button>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-center">
                     <p 
                       className="text-xs text-primary-foreground text-center w-20 cursor-pointer hover:text-primary-glow font-bold break-words"
                       onClick={() => startEditingName(profile)}
                     >
                       {profile.name}
                     </p>
                     <Button
                       onClick={() => startEditingName(profile)}
                       className="w-3 h-3 text-primary-foreground rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                       style={{ backgroundColor: 'hsl(var(--primary))' }}
                       size="sm"
                     >
                       <Edit2 className="w-1.5 h-1.5" />
                     </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-0.5 -right-0.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                     <Button
                       onClick={(e) => {
                         e.stopPropagation();
                         moveProfile(profile.id, 'up');
                       }}
                       className="w-4 h-4 text-primary-foreground rounded-full p-0 hover:scale-110 transition-transform shadow-lg"
                       style={{ backgroundColor: 'hsl(var(--primary))' }}
                       size="sm"
                     >
                       <ChevronUp className="w-2 h-2" />
                     </Button>
                  )}
                  {index < savedProfiles.length - 1 && (
                     <Button
                       onClick={(e) => {
                         e.stopPropagation();
                         moveProfile(profile.id, 'down');
                       }}
                       className="w-4 h-4 text-primary-foreground rounded-full p-0 hover:scale-110 transition-transform shadow-lg"
                       style={{ backgroundColor: 'hsl(var(--primary))' }}
                       size="sm"
                     >
                       <ChevronDown className="w-2 h-2" />
                     </Button>
                  )}
                   <Button
                     onClick={(e) => {
                       e.stopPropagation();
                       deleteProfile(profile.id);
                     }}
                     className="w-4 h-4 text-primary-foreground rounded-full p-0 hover:scale-110 transition-transform shadow-lg"
                     style={{ backgroundColor: 'hsl(var(--primary))' }}
                     size="sm"
                   >
                     <X className="w-2 h-2" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm theme-text-muted text-center py-4 font-bold">
            No saved profiles yet. Click "New Profile" to get started!
          </p>
        )}
      </div>
      {/* Hidden File Inputs */}
      <input
        ref={mainImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, true);
        }}
      />
      <input
        ref={smallerImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, false, true);
        }}
      />
      {transformControls.map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            if (el) thumbnailInputRefs.current[index] = el;
          }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, false, false, index);
          }}
        />
      ))}
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
      {transformControls.map((controlId) => (
        <input
          key={`transform2-${controlId}`}
          ref={(el) => {
            if (el) transformImage2InputRefs.current[controlId] = el;
          }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, false, false, undefined, controlId, true);
          }}
        />
      ))}
      

      {/* Main Image Subsection - Only show when main image is uploaded */}
      {currentMainImage && (
        <div className="bg-overlay-surface rounded-xl p-4 shadow-panel border border-overlay-border max-h-[600px] overflow-y-auto custom-scrollbar" style={{
          backgroundColor: 'hsl(var(--overlay-surface))',
          borderColor: 'hsl(var(--overlay-border))',
          boxShadow: 'var(--shadow-panel)'
        }}>
          <h3 className="text-base font-bold theme-title-primary mb-2 flex items-center gap-2">
            <span>🎨</span> {(() => {
              if (activeProfileId) {
                const currentProfile = savedProfiles.find(p => p.id === activeProfileId);
                return currentProfile?.name || `Profile ${savedProfiles.findIndex(p => p.id === activeProfileId) + 1}`;
              }
              return 'New Profile';
            })()}
          </h3>
          
          <div className="flex gap-1">
            {/* Main Image Display */}
            <div className="flex-shrink-0">
              <img
                src={imageMap[currentMainImage] || currentMainImage}
                alt="Main image"
                className="w-32 h-32 object-cover rounded-lg shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer"
                style={{ 
                  imageRendering: 'auto', 
                  maxWidth: 'none',
                  filter: 'contrast(1.05) saturate(1.1) brightness(1.02)'
                }}
              />
            </div>
            
            {/* Transform Controls */}
            <div className="flex-1 space-y-1 max-h-[1200px] overflow-y-auto custom-scrollbar pr-2">
              {transformControls.map((controlId, index) => {
                const imageKey = `${smallerImage || 'smaller-image-default'}-${controlId}`;
                const settings = getImageSettings(imageKey);
                
                return (
                   <div key={controlId} className="p-0.5 bg-overlay-surface rounded-lg border border-overlay-border" style={{
                     backgroundColor: 'hsl(var(--overlay-surface))',
                     borderColor: 'hsl(var(--overlay-border))'
                   }}>
                    <div className="flex gap-2">
                      {/* Image Upload Section - Left Side */}
                           <div className="flex-shrink-0">
                             <div className="relative">
                               {transformImages[controlId] ? (
                                 <img
                                   src={imageMap[transformImages[controlId]] || transformImages[controlId]}
                                   alt={`Transform image ${index + 1}`}
                                    className="w-28 h-28 object-cover rounded shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                                   style={{ 
                                     imageRendering: 'auto', 
                                     maxWidth: 'none',
                                     filter: 'contrast(1.05) saturate(1.1) brightness(1.02)'
                                   }}
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
                                  title={`Upload image for Set ${index + 1}`}
                                >
                                  <Upload className="w-2 h-2" />
                               </Button>
                             </div>
                             
                             {/* Second Image Upload - Only for colours category */}
                             {category === 'colours' && (
                               <div className="relative mt-2">
                                 {transformImages2[controlId] ? (
                                   <img
                                     src={imageMap[transformImages2[controlId]] || transformImages2[controlId]}
                                     alt={`Second transform image ${index + 1}`}
                                     className="w-28 h-28 object-cover rounded shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                                     style={{ 
                                       imageRendering: 'auto', 
                                       maxWidth: 'none',
                                       filter: 'contrast(1.05) saturate(1.1) brightness(1.02)'
                                     }}
                                   />
                                 ) : (
                                    <div className="theme-placeholder-bg w-28 h-28 rounded shadow-md flex items-center justify-center border border-dashed border-overlay-border">
                                      <Upload className="w-7 h-7 theme-icon-primary" />
                                   </div>
                                 )}
                                 
                                  <Button
                                    onClick={() => triggerTransformImage2Upload(controlId)}
                                    className="absolute -top-1 -right-1 text-primary-foreground p-0.5 rounded-full shadow-lg backdrop-blur-sm z-20 bg-primary hover:bg-primary/90"
                                    size="sm"
                                    title={`Upload second image for Set ${index + 1}`}
                                  >
                                    <Upload className="w-2 h-2" />
                                 </Button>
                               </div>
                             )}
                           </div>

                      {/* Controls Section - Right Side */}
                      <div className="flex-1">
                        <h4 className="text-xs font-bold theme-text-primary mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span>Set {index + 1}</span>
             <Button
               onClick={() => removeTransformControl(controlId)}
               className="w-3 h-3 text-primary-foreground rounded-full p-0 hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
               size="sm"
               title={`Remove Set ${index + 1}`}
             >
               <X className="w-1.5 h-1.5" />
                            </Button>
                          </div>
                        </h4>
                        
                          <div className={cn("grid gap-0.5", category === 'colours' ? "grid-cols-1" : "grid-cols-3")}>
                            {/* Position Controls - Hidden for colours */}
                            {category !== 'colours' && (
                             <div>
                               <p className="font-bold theme-text-primary mb-0.5 text-xs">Position</p>
                               <div className="space-y-0">
                                  <div className="flex items-center gap-1">
                                     <span 
                                        className="text-xs theme-label cursor-pointer hover:opacity-80 font-bold"
                                       onClick={() => copyToClipboard(settings.position.x, "X")}
                                       title="Click to copy X value"
                                     >x</span>
                                     <input 
                                       type="number"
                                        className="w-12 px-1 py-0.5 text-xs rounded border theme-input font-bold"
                                       value={settings.position.x}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         position: { ...settings.position, x: parseFloat(e.target.value) || 0 }
                                       })}
                                     />
                                  </div>
                                  <div className="flex items-center gap-1">
                                     <span 
                                        className="text-xs theme-text-primary cursor-pointer hover:opacity-80 font-bold"
                                       onClick={() => copyToClipboard(settings.position.y, "Y")}
                                       title="Click to copy Y value"
                                     >y</span>
                                     <input 
                                       type="number"
                                        className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                       value={settings.position.y}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         position: { ...settings.position, y: parseFloat(e.target.value) || 0 }
                                       })}
                                     />
                                  </div>
                                  <div className="flex items-center gap-1">
                                     <span 
                                        className="text-xs theme-text-primary cursor-pointer hover:opacity-80 font-bold"
                                       onClick={() => copyToClipboard(settings.position.z, "Z")}
                                       title="Click to copy Z value"
                                     >z</span>
                                     <input 
                                       type="number"
                                        className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                       value={settings.position.z}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         position: { ...settings.position, z: parseFloat(e.target.value) || 0 }
                                       })}
                                     />
                                  </div>
                               </div>
                             </div>
                           )}
                           
                            {/* Rotation Controls - Hidden for colours */}
                            {category !== 'colours' && (
                             <div>
                               <p className="font-bold theme-text-primary mb-0.5 text-xs">Rotation</p>
                               <div className="space-y-0">
                                  <div className="flex items-center gap-1">
                                     <span 
                                        className="text-xs theme-text-primary cursor-pointer hover:opacity-80 font-bold"
                                       onClick={() => copyToClipboard(settings.rotation.x, "X")}
                                       title="Click to copy X value"
                                     >x</span>
                                     <input 
                                       type="number"
                                        className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                       value={settings.rotation.x}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         rotation: { ...settings.rotation, x: parseFloat(e.target.value) || 0 }
                                       })}
                                     />
                                  </div>
                                   <div className="flex items-center gap-1">
                                     <span 
                                        className="text-xs theme-text-primary cursor-pointer hover:opacity-80 font-bold"
                                       onClick={() => copyToClipboard(settings.rotation.y, "Y")}
                                       title="Click to copy Y value"
                                     >y</span>
                                     <input 
                                       type="number"
                                        className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                       value={settings.rotation.y}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         rotation: { ...settings.rotation, y: parseFloat(e.target.value) || 0 }
                                       })}
                                     />
                                  </div>
                                  <div className="flex items-center gap-1">
                                     <span 
                                       className="text-xs theme-text-primary cursor-pointer hover:opacity-80 font-bold"
                                       onClick={() => copyToClipboard(settings.rotation.z, "Z")}
                                       title="Click to copy Z value"
                                     >z</span>
                                     <input 
                                       type="number"
                                        className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                       value={settings.rotation.z}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         rotation: { ...settings.rotation, z: parseFloat(e.target.value) || 0 }
                                       })}
                                     />
                                  </div>
                               </div>
                             </div>
                           )}
                           
                            {/* Scale Control - Hidden for colours */}
                            {category !== 'colours' && (
                             <div>
                               <p 
                                 className="font-bold theme-text-primary mb-0.5 text-xs cursor-pointer hover:opacity-80"
                                 onClick={() => copyToClipboard(settings.scale, "Scale")}
                                 title="Click to copy Scale value"
                               >Scale</p>
                                <div className="space-y-0">
                                   <input 
                                     type="text"
                                     step="0.1"
                                     className="w-16 px-1 py-0.5 text-xs rounded border theme-input font-bold" 
                                     value={settings.scale}
                                     onChange={(e) => handleScaleChange(imageKey, e.target.value)}
                                   />
                                 <div>
                                 <label 
                                    className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                   onClick={() => copyToClipboard(settings.scaleHex || '#ffffff', "Hex Code")}
                                   title="Click to copy Hex value"
                                 >Hex Code</label>
                                 <div className="flex items-center gap-1">
                                     <input 
                                       type="text"
                                       placeholder="#ffffff"
                                        className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold"
                                       value={settings.scaleHex || '#ffffff'}
                                       onChange={(e) => updateImageSettings(imageKey, { 
                                         scaleHex: e.target.value 
                                       })}
                                     />
                                     <Heart 
                                       className="w-10 h-10 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                       style={{ 
                                         fill: settings.scaleHex || '#ffffff', 
                                         stroke: '#ec4899', 
                                         strokeWidth: 1.5 
                                       }}
                                       onClick={() => copyToClipboard(settings.scaleHex || '#ffffff', "Hex Color")}
                                     />
                                 </div>
                                </div>
                              </div>
                             </div>
                           )}
                           
                           {/* Hex Colors - Only for colours category */}
                           {category === 'colours' && (
                             <div className="grid grid-cols-2 gap-4">
                               {/* Left Column */}
                               <div className="space-y-2">
                                 {/* Hex Color 1 */}
                                 <div>
                                   <label 
                                      className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                     onClick={() => copyToClipboard(settings.hexColor1 || '#ffffff', "Hex Color 1")}
                                     title="Click to copy Hex Color 1"
                                   >Hex Color 1</label>
                                   <div className="flex items-center gap-1">
                                       <input 
                                         type="text"
                                         placeholder="#ffffff"
                                          className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold"
                                         value={settings.hexColor1 || '#ffffff'}
                                         onChange={(e) => updateImageSettings(imageKey, { 
                                           hexColor1: e.target.value 
                                         })}
                                       />
                                       <Heart 
                                         className="w-8 h-8 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                         style={{ 
                                           fill: settings.hexColor1 || '#ffffff', 
                                           stroke: '#ec4899', 
                                           strokeWidth: 1.5 
                                         }}
                                         onClick={() => copyToClipboard(settings.hexColor1 || '#ffffff', "Hex Color 1")}
                                       />
                                   </div>
                                 </div>
                                 
                                 {/* Hex Color 2 */}
                                 <div>
                                   <label 
                                      className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                     onClick={() => copyToClipboard(settings.hexColor2 || '#ffffff', "Hex Color 2")}
                                     title="Click to copy Hex Color 2"
                                   >Hex Color 2</label>
                                   <div className="flex items-center gap-1">
                                       <input 
                                         type="text"
                                         placeholder="#ffffff"
                                          className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold"
                                         value={settings.hexColor2 || '#ffffff'}
                                         onChange={(e) => updateImageSettings(imageKey, { 
                                           hexColor2: e.target.value 
                                         })}
                                       />
                                       <Heart 
                                         className="w-8 h-8 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                         style={{ 
                                           fill: settings.hexColor2 || '#ffffff', 
                                           stroke: '#ec4899', 
                                           strokeWidth: 1.5 
                                         }}
                                         onClick={() => copyToClipboard(settings.hexColor2 || '#ffffff', "Hex Color 2")}
                                       />
                                   </div>
                                 </div>
                                 
                                 {/* Hex Color 3 */}
                                 <div>
                                   <label 
                                      className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                     onClick={() => copyToClipboard(settings.hexColor3 || '#ffffff', "Hex Color 3")}
                                     title="Click to copy Hex Color 3"
                                   >Hex Color 3</label>
                                   <div className="flex items-center gap-1">
                                       <input 
                                         type="text"
                                         placeholder="#ffffff"
                                          className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold"
                                         value={settings.hexColor3 || '#ffffff'}
                                         onChange={(e) => updateImageSettings(imageKey, { 
                                           hexColor3: e.target.value 
                                         })}
                                       />
                                       <Heart 
                                         className="w-8 h-8 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                         style={{ 
                                           fill: settings.hexColor3 || '#ffffff', 
                                           stroke: '#ec4899', 
                                           strokeWidth: 1.5 
                                         }}
                                         onClick={() => copyToClipboard(settings.hexColor3 || '#ffffff', "Hex Color 3")}
                                       />
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Right Column */}
                               <div className="space-y-2">
                                 {/* Hex Color 4 */}
                                 <div>
                                   <label 
                                      className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                     onClick={() => copyToClipboard(settings.hexColor4 || '#ffffff', "Hex Color 4")}
                                     title="Click to copy Hex Color 4"
                                   >Hex Color 4</label>
                                   <div className="flex items-center gap-1">
                                       <input 
                                         type="text"
                                         placeholder="#ffffff"
                                          className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold"
                                         value={settings.hexColor4 || '#ffffff'}
                                         onChange={(e) => updateImageSettings(imageKey, { 
                                           hexColor4: e.target.value 
                                         })}
                                       />
                                       <Heart 
                                         className="w-8 h-8 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                         style={{ 
                                           fill: settings.hexColor4 || '#ffffff', 
                                           stroke: '#ec4899', 
                                           strokeWidth: 1.5 
                                         }}
                                         onClick={() => copyToClipboard(settings.hexColor4 || '#ffffff', "Hex Color 4")}
                                       />
                                   </div>
                                 </div>
                                 
                                 {/* Hex Color 5 */}
                                 <div>
                                   <label 
                                      className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                     onClick={() => copyToClipboard(settings.hexColor5 || '#ffffff', "Hex Color 5")}
                                     title="Click to copy Hex Color 5"
                                   >Hex Color 5</label>
                                   <div className="flex items-center gap-1">
                                       <input 
                                         type="text"
                                         placeholder="#ffffff"
                                          className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold"
                                         value={settings.hexColor5 || '#ffffff'}
                                         onChange={(e) => updateImageSettings(imageKey, { 
                                           hexColor5: e.target.value 
                                         })}
                                       />
                                       <Heart 
                                         className="w-8 h-8 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                         style={{ 
                                           fill: settings.hexColor5 || '#ffffff', 
                                           stroke: '#ec4899', 
                                           strokeWidth: 1.5 
                                         }}
                                         onClick={() => copyToClipboard(settings.hexColor5 || '#ffffff', "Hex Color 5")}
                                       />
                                   </div>
                                 </div>
                                 
                                 {/* Hex Color 6 */}
                                 <div>
                                   <label 
                                     className="text-xs theme-text-primary mb-0.5 block font-bold cursor-pointer hover:opacity-80"
                                     onClick={() => copyToClipboard(settings.hexColor6 || '#ffffff', "Hex Color 6")}
                                     title="Click to copy Hex Color 6"
                                   >Hex Color 6</label>
                                   <div className="flex items-center gap-1">
                                       <input 
                                         type="text"
                                         placeholder="#ffffff"
                                         className="w-16 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold" 
                                         value={settings.hexColor6 || '#ffffff'}
                                         onChange={(e) => updateImageSettings(imageKey, { 
                                           hexColor6: e.target.value 
                                         })}
                                       />
                                       <Heart 
                                         className="w-8 h-8 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                         style={{ 
                                           fill: settings.hexColor6 || '#ffffff', 
                                           stroke: '#ec4899', 
                                           strokeWidth: 1.5 
                                         }}
                                         onClick={() => copyToClipboard(settings.hexColor6 || '#ffffff', "Hex Color 6")}
                                       />
                                   </div>
                                 </div>
                               </div>
                             </div>
                           )}
                             
                              {/* Notes Control - Hidden for colours */}
                              {category !== 'colours' && (
                               <div>
                                  <p className="font-bold theme-text-primary mb-0.5 text-xs">Notes</p>
                                  <div className="space-y-0">
                                    <textarea
                                      className="w-full px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold resize-none" 
                                      value={settings.notes || ''}
                                      onChange={(e) => updateImageSettings(imageKey, { 
                                        notes: e.target.value 
                                      })}
                                      placeholder="Add notes..."
                                      rows={3}
                                    />
                                 </div>
                               </div>
                             )}
                           </div>
                          
                        {/* Save and Clear Buttons */}
                        <div className="flex justify-between mt-1">
                           <Button
                             onClick={() => clearImageSettings(imageKey)}
                             className="text-primary-foreground px-1 py-0 text-xs font-bold bg-primary hover:bg-primary/90"
                           >
                             Clear
                           </Button>
                           <Button
                             onClick={() => saveImageSettings(imageKey)}
                             className="text-primary-foreground px-1 py-0 text-xs font-bold bg-primary hover:bg-primary/90"
                           >
                             Save
                           </Button>
                        </div>
                      </div>
                    </div>
                   </div>
                 );
               })}
             </div>
           </div>
          
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
      )}
      
      {/* Side Panel with Scrollable Thumbnails */}
      <div className="flex-1 min-w-0">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {currentThumbnails.length > 0 && currentThumbnails.map((thumbnail, index) => {
            const imageKey = thumbnail;
            const settings = getImageSettings(imageKey);
            
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-overlay-surface/80 via-overlay-bg to-overlay-surface/60 rounded-lg border border-overlay-border hover:border-overlay-border hover:opacity-90 transition-all duration-300 hover:shadow-md cursor-pointer group"
              >
                {/* Thumbnail Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={imageMap[thumbnail] || thumbnail}
                    alt={`Variation ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-md group-hover:scale-125 transition-transform duration-300 shadow-sm"
                    onClick={() => setSelectedImage(thumbnail)}
                  />
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: selectedColor }}
                  />
                  
                  {/* Change Thumbnail Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerThumbnailUpload(index);
                    }}
                     className="absolute -bottom-1 -right-1 text-primary-foreground p-0.5 rounded-full shadow-lg backdrop-blur-sm bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <Upload className="w-2 h-2" />
                  </Button>
                </div>
                
                {/* Controls */}
                <div className="flex-1 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Position Controls */}
                    <div>
                      <p className="font-bold theme-text-primary mb-1">Position</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                             <span 
                                className="text-xs theme-text-primary w-4 font-bold cursor-pointer hover:opacity-80"
                               onClick={() => copyToClipboard(settings.position.x, "X")}
                               title="Click to copy X value"
                             >X:</span>
                              <input 
                                 className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                value={settings.position.x}
                                onChange={(e) => updateImageSettings(imageKey, { 
                                  position: { ...settings.position, x: parseFloat(e.target.value) || 0 }
                                })}
                              />
                          </div>
                          <div className="flex items-center gap-2">
                             <span 
                               className="text-xs text-pink-600 w-4 font-bold cursor-pointer hover:text-pink-800"
                               onClick={() => copyToClipboard(settings.position.y, "Y")}
                               title="Click to copy Y value"
                             >Y:</span>
                              <input 
                                 className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                value={settings.position.y}
                                onChange={(e) => updateImageSettings(imageKey, { 
                                  position: { ...settings.position, y: parseFloat(e.target.value) || 0 }
                                })}
                              />
                          </div>
                          <div className="flex items-center gap-2">
                             <span 
                               className="text-xs text-pink-600 w-4 font-bold cursor-pointer hover:text-pink-800"
                               onClick={() => copyToClipboard(settings.position.z, "Z")}
                               title="Click to copy Z value"
                             >Z:</span>
                              <input 
                                 className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
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
                      <p className="font-bold text-pink-600 mb-1">Rotate</p>
                      <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span 
                               className="text-xs text-pink-600 w-4 font-bold cursor-pointer hover:text-pink-800"
                               onClick={() => copyToClipboard(settings.rotation.x, "X")}
                               title="Click to copy X value"
                             >X:</span>
                              <input 
                                 className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                value={settings.rotation.x}
                                onChange={(e) => updateImageSettings(imageKey, { 
                                  rotation: { ...settings.rotation, x: parseFloat(e.target.value) || 0 }
                                })}
                              />
                          </div>
                          <div className="flex items-center gap-2">
                             <span 
                               className="text-xs text-pink-600 w-4 font-bold cursor-pointer hover:text-pink-800"
                               onClick={() => copyToClipboard(settings.rotation.y, "Y")}
                               title="Click to copy Y value"
                             >Y:</span>
                              <input 
                                 className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
                                value={settings.rotation.y}
                                onChange={(e) => updateImageSettings(imageKey, { 
                                  rotation: { ...settings.rotation, y: parseFloat(e.target.value) || 0 }
                                })}
                              />
                          </div>
                          <div className="flex items-center gap-2">
                             <span 
                               className="text-xs text-pink-600 w-4 font-bold cursor-pointer hover:text-pink-800"
                               onClick={() => copyToClipboard(settings.rotation.z, "Z")}
                               title="Click to copy Z value"
                             >Z:</span>
                              <input 
                                 className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold"
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
                       <p 
                         className="font-bold text-pink-600 mb-1 cursor-pointer hover:text-pink-800"
                         onClick={() => copyToClipboard(settings.scale, "Scale")}
                         title="Click to copy Scale value"
                       >Scale</p>
                        <div className="flex gap-2 items-center">
                             <input 
                               type="text"
                               className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold" 
                               value={settings.scale}
                               onChange={(e) => handleScaleChange(imageKey, e.target.value)}
                             />
                           <div className="flex flex-col">
                              <label 
                                className="text-xs text-pink-600 mb-0.5 font-bold cursor-pointer hover:text-pink-800"
                                onClick={() => copyToClipboard(settings.scaleHex || '#ffffff', "Hex Code")}
                                title="Click to copy Hex value"
                              >Hex Code</label>
                             <div className="flex items-center gap-1">
                                 <input 
                                   type="text"
                                   placeholder="#ffffff"
                                   className="w-12 px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-mono font-bold" 
                                   value={settings.scaleHex || '#ffffff'}
                                   onChange={(e) => updateImageSettings(imageKey, { 
                                     scaleHex: e.target.value 
                                   })}
                                 />
                                 <Heart 
                                   className="w-10 h-10 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                                   style={{ 
                                     fill: settings.scaleHex || '#ffffff', 
                                     stroke: '#ec4899', 
                                     strokeWidth: 1.5 
                                   }}
                                   onClick={() => copyToClipboard(settings.scaleHex || '#ffffff', "Hex Color")}
                                 />
                             </div>
                         </div>
                     </div>
                     
                     {/* Notes Control */}
                     <div className="flex-1">
                         <p className="font-bold theme-text-primary mb-1">Notes</p>
                          <div className="flex gap-2 items-center">
                             <textarea 
                               className="w-full px-1 py-0.5 text-xs rounded border theme-input focus:border-primary focus:outline-none theme-text-primary font-bold resize-none" 
                               value={settings.notes || ''}
                               onChange={(e) => updateImageSettings(imageKey, { 
                                 notes: e.target.value 
                               })}
                               placeholder="Add notes..."
                               rows={2}
                             />
                         </div>
                     </div>
                   </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                       <Button
                         size="sm"
                         onClick={() => saveImageSettings(imageKey)}
                          className="text-primary-foreground px-3 py-1 text-xs font-bold bg-primary hover:bg-primary/90"
                       >
                         <Save className="w-3 h-3 mr-1" />
                         Save
                       </Button>
                       <Button
                         size="sm"
                         onClick={() => clearImageSettings(imageKey)}
                         className="text-primary-foreground px-3 py-1 text-xs font-bold bg-primary hover:bg-primary/90"
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