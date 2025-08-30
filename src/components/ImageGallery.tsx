import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Upload, Camera, ChevronUp, ChevronDown, Edit2, Plus, Check, X, Heart } from 'lucide-react';
import GlitterBorder from './GlitterBorder';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
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
  scale: number;
  scaleHex?: string;
}

interface SavedProfile {
  id: string;
  name: string;
  thumbnail: string;
  mainImage: string;
  settings: Record<string, ImageSettings>;
  transformImages: Record<string, string>;
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
  const thumbnailInputRefs = useRef<Record<number, HTMLInputElement>>({});

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleImageUpload = (file: File, isMain: boolean = false, isSmaller: boolean = false, thumbnailIndex?: number, transformId?: string) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        if (isMain) {
          setCurrentMainImage(imageUrl);
          setSelectedImage(imageUrl);
          toast({
            title: "📸 Main Image Updated!",
            description: "New main image has been loaded",
          });
        } else if (isSmaller) {
          setSmallerImage(imageUrl);
          toast({
            title: "🖼️ Smaller Image Updated!",
            description: "Smaller image has been loaded",
          });
        } else if (transformId) {
          setTransformImages(prev => ({
            ...prev,
            [transformId]: imageUrl
          }));
          toast({
            title: "🖼️ Transform Image Updated!",
            description: "Transform control image has been loaded",
          });
        } else if (thumbnailIndex !== undefined) {
          const newThumbnails = [...currentThumbnails];
          newThumbnails[thumbnailIndex] = imageUrl;
          setCurrentThumbnails(newThumbnails);
          toast({
            title: "🖼️ Thumbnail Updated!",
            description: `Thumbnail ${thumbnailIndex + 1} has been updated`,
          });
        }
      };
      reader.readAsDataURL(file);
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

  const triggerThumbnailUpload = (index: number) => {
    thumbnailInputRefs.current[index]?.click();
  };

  const getImageSettings = (imageKey: string): ImageSettings => {
    return imageSettings[imageKey] || {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1.0,
      scaleHex: '#ffffff'
    };
  };

  const updateImageSettings = (imageKey: string, settings: Partial<ImageSettings>) => {
    setImageSettings(prev => ({
      ...prev,
      [imageKey]: { ...getImageSettings(imageKey), ...settings }
    }));
  };

  const handleScaleChange = (imageKey: string, value: string) => {
    // Allow partial decimal inputs like "0." or "1."
    if (value === '' || value === '0.' || /^\d*\.?\d*$/.test(value)) {
      updateImageSettings(imageKey, { 
        scale: value === '' ? 0 : (value.endsWith('.') ? parseFloat(value + '0') : parseFloat(value)) || 0
      });
    }
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
    toast({
      title: "➕ Control Added!",
      description: "New transform control set created with image upload",
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

  const clearImageSettings = (imageKey: string) => {
    const defaultSettings = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1.0,
      scaleHex: '#ffffff'
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
      
      // Check if the data is too large (over 4MB to be safe)
      if (profilesData.length > 4 * 1024 * 1024) {
        // Remove oldest profiles to make space
        const reducedProfiles = savedProfiles.slice(-5); // Keep only last 5 profiles
        localStorage.setItem(`saved-profiles-${category}`, JSON.stringify(reducedProfiles));
        setSavedProfiles(reducedProfiles);
        
        toast({
          title: "⚠️ Storage Limit Reached",
          description: "Removed older profiles to save new data. Consider using fewer or smaller images.",
        });
      } else {
        localStorage.setItem(`saved-profiles-${category}`, profilesData);
      }
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
      <div className="bg-gradient-to-br from-pink-50/80 via-white to-pink-100/60 rounded-xl p-4 shadow-lg border border-pink-200 max-h-60 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-pink-600 flex items-center gap-2">
            <span>📁</span> Saved Profiles
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={newProfile}
              className="text-white px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: '#ffb3d6' }}
              size="sm"
            >
              <Plus className="w-3 h-3 mr-1" />
              New Profile
            </Button>
            <Button
              onClick={saveProfile}
              className="px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: '#ffb3d6' }}
              size="sm"
            >
              💾 {activeProfileId ? 'Update Profile' : 'Save Profile'}
            </Button>
          </div>
        </div>
        
        {savedProfiles.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 px-3">
            {savedProfiles.map((profile, index) => (
              <div key={profile.id} className="flex-shrink-0 relative group p-2">
                <div 
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:scale-125",
                    activeProfileId === profile.id 
                      ? "border-pink-400 ring-2 ring-pink-200" 
                      : "border-pink-200 hover:border-pink-400"
                  )}
                  onClick={() => loadProfile(profile)}
                >
                  <img
                    src={imageMap[profile.thumbnail] || profile.thumbnail}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Profile Name - Editable */}
                {editingProfileId === profile.id ? (
                  <div className="mt-1 flex items-center gap-1">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-16 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveProfileName();
                        if (e.key === 'Escape') cancelEditingName();
                      }}
                      autoFocus
                    />
                    <Button
                      onClick={saveProfileName}
                      className="w-3 h-3 text-white rounded-full p-0"
                      style={{ backgroundColor: '#ffb3d6' }}
                      size="sm"
                    >
                      <Check className="w-2 h-2" />
                    </Button>
                    <Button
                      onClick={cancelEditingName}
                      className="w-3 h-3 text-white rounded-full p-0"
                      style={{ backgroundColor: '#ffb3d6' }}
                      size="sm"
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-center">
                    <p 
                      className="text-xs text-pink-600 text-center truncate w-16 cursor-pointer hover:text-pink-600 font-bold"
                      onClick={() => startEditingName(profile)}
                    >
                      {profile.name}
                    </p>
                    <Button
                      onClick={() => startEditingName(profile)}
                      className="w-3 h-3 text-white rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                      style={{ backgroundColor: '#ffb3d6' }}
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
                      className="w-4 h-4 text-white rounded-full p-0 hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: '#ffb3d6' }}
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
                      className="w-4 h-4 text-white rounded-full p-0 hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: '#ffb3d6' }}
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
                    className="w-4 h-4 text-white rounded-full p-0 hover:scale-110 transition-transform shadow-lg"
                    style={{ backgroundColor: '#ffb3d6' }}
                    size="sm"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-pink-600 text-center py-4 font-bold">
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
      

      {/* Main Image Subsection - Only show when main image is uploaded */}
      {currentMainImage && (
        <div className="bg-gradient-to-br from-pink-50/80 via-white to-pink-100/60 rounded-xl p-3 shadow-lg border border-pink-200 max-h-80 overflow-y-auto custom-scrollbar">
          <h3 className="text-base font-bold text-pink-600 mb-2 flex items-center gap-2">
            <span>🎨</span> Image Configuration
          </h3>
          
          <div className="flex gap-1">
            {/* Main Image Display */}
            <div className="flex-shrink-0">
              <img
                src={imageMap[currentMainImage] || currentMainImage}
                alt="Main image"
                className="w-20 h-20 object-cover rounded-lg shadow-md hover:scale-125 transition-transform duration-300 cursor-pointer"
              />
            </div>
            
            {/* Transform Controls */}
            <div className="flex-1 space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {transformControls.map((controlId, index) => {
                const imageKey = `${smallerImage || 'smaller-image-default'}-${controlId}`;
                const settings = getImageSettings(imageKey);
                
                return (
                  <div key={controlId} className="p-1 bg-white/80 rounded-lg border border-pink-200">
                    <h4 className="text-xs font-bold text-pink-600 mb-1 flex items-center justify-between">
                      <span>Set {index + 1}</span>
                      <div className="flex items-center gap-1">
                        {/* Image Upload for each Transform Set */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {transformImages[controlId] ? (
                              <img
                                src={imageMap[transformImages[controlId]] || transformImages[controlId]}
                                alt={`Transform image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded shadow-md"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-pink-50 rounded shadow-md flex items-center justify-center border border-dashed border-pink-300">
                                <Upload className="w-5 h-5 text-pink-600" />
                              </div>
                            )}
                            
                            <Button
                              onClick={() => triggerTransformImageUpload(controlId)}
                              className="absolute -top-0.5 -right-0.5 text-white p-0.5 rounded-full shadow-lg backdrop-blur-sm z-20"
                              style={{ backgroundColor: '#ffb3d6' }}
                              size="sm"
                              title={`Upload image for Set ${index + 1}`}
                            >
                              <Upload className="w-1 h-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-1">
                      {/* Position Controls */}
                      <div>
                        <p className="font-bold text-pink-600 mb-1 text-xs">Position</p>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">x</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.position.x}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                position: { ...settings.position, x: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">y</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.position.y}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                position: { ...settings.position, y: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">z</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold"
                              value={settings.position.z}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                position: { ...settings.position, z: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Rotation Controls */}
                      <div>
                        <p className="font-bold text-pink-600 mb-1 text-xs">Rotation</p>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">x</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.rotation.x}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                rotation: { ...settings.rotation, x: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">y</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.rotation.y}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                rotation: { ...settings.rotation, y: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">z</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold"
                              value={settings.rotation.z}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                rotation: { ...settings.rotation, z: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Scale Control */}
                      <div>
                        <p className="font-bold text-pink-600 mb-1 text-xs">Scale</p>
                        <div className="space-y-1">
                          <input 
                            type="text"
                            step="0.1"
                            className="w-16 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                            value={settings.scale}
                            onChange={(e) => handleScaleChange(imageKey, e.target.value)}
                          />
                          <div>
                            <label className="text-xs text-pink-600 mb-0.5 block font-bold">Hex Code</label>
                            <div className="flex items-center gap-1">
                              <input 
                                type="text"
                                placeholder="#ffffff"
                                className="w-16 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-mono font-bold" 
                                value={settings.scaleHex || '#ffffff'}
                                onChange={(e) => updateImageSettings(imageKey, { 
                                  scaleHex: e.target.value 
                                })}
                              />
                              <Heart 
                                className="w-5 h-5 flex-shrink-0" 
                                style={{ 
                                  fill: settings.scaleHex || '#ffffff', 
                                  stroke: '#ec4899', 
                                  strokeWidth: 1 
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      
                      {/* Save and Clear Buttons */}
                      <div className="flex justify-between mt-1">
                        <Button
                          onClick={() => clearImageSettings(imageKey)}
                          className="text-white px-2 py-0.5 text-xs font-bold"
                          style={{ backgroundColor: '#ffb3d6' }}
                        >
                          Clear
                        </Button>
                        <Button
                          onClick={() => saveImageSettings(imageKey)}
                          className="text-white px-2 py-0.5 text-xs font-bold"
                          style={{ backgroundColor: '#ffb3d6' }}
                        >
                          Save
                        </Button>
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
              className="text-white px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: '#ffb3d6' }}
            >
              <Plus className="w-3 h-3 text-white mr-1" /> Add
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
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-pink-50/80 via-white to-pink-100/60 rounded-lg border border-pink-200 hover:border-pink-300 transition-all duration-300 hover:shadow-md cursor-pointer group"
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
                    className="absolute -bottom-1 -right-1 text-white p-0.5 rounded-full shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: '#ffb3d6' }}
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
                      <p className="font-bold text-pink-600 mb-1">Position</p>
                      <div className="space-y-1">
                       <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-600 w-4 font-bold">X:</span>
                            <input 
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.position.x}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                position: { ...settings.position, x: parseFloat(e.target.value) || 0 }
                              })}
                            />
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-600 w-4 font-bold">Y:</span>
                            <input 
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.position.y}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                position: { ...settings.position, y: parseFloat(e.target.value) || 0 }
                              })}
                            />
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-600 w-4 font-bold">Z:</span>
                            <input 
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
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
                            <span className="text-xs text-pink-600 w-4 font-bold">X:</span>
                            <input 
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.rotation.x}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                rotation: { ...settings.rotation, x: parseFloat(e.target.value) || 0 }
                              })}
                            />
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-600 w-4 font-bold">Y:</span>
                            <input 
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                              value={settings.rotation.y}
                              onChange={(e) => updateImageSettings(imageKey, { 
                                rotation: { ...settings.rotation, y: parseFloat(e.target.value) || 0 }
                              })}
                            />
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-600 w-4 font-bold">Z:</span>
                            <input 
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
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
                      <p className="font-bold text-pink-600 mb-1">Scale</p>
                        <div className="flex gap-2 items-center">
                           <input 
                             type="text"
                             className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-bold" 
                             value={settings.scale}
                             onChange={(e) => handleScaleChange(imageKey, e.target.value)}
                           />
                           <div className="flex flex-col">
                             <label className="text-xs text-pink-600 mb-0.5 font-bold">Hex Code</label>
                             <div className="flex items-center gap-1">
                               <input 
                                 type="text"
                                 placeholder="#ffffff"
                                 className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-pink-600 font-mono font-bold" 
                                 value={settings.scaleHex || '#ffffff'}
                                 onChange={(e) => updateImageSettings(imageKey, { 
                                   scaleHex: e.target.value 
                                 })}
                               />
                               <Heart 
                                 className="w-5 h-5 flex-shrink-0" 
                                 style={{ 
                                   fill: settings.scaleHex || '#ffffff', 
                                   stroke: '#ec4899', 
                                   strokeWidth: 1 
                                 }} 
                               />
                             </div>
                           </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveImageSettings(imageKey)}
                         className="text-white px-3 py-1 text-xs font-bold"
                        style={{ backgroundColor: '#ffb3d6' }}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => clearImageSettings(imageKey)}
                        className="text-white px-3 py-1 text-xs font-bold"
                        style={{ backgroundColor: '#ffb3d6' }}
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