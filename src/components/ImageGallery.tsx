import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Upload, Camera } from 'lucide-react';
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
}) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSettings, setImageSettings] = useState<Record<string, ImageSettings>>({});
  const [currentMainImage, setCurrentMainImage] = useState('');
  const [currentThumbnails, setCurrentThumbnails] = useState<string[]>([]);
  const [smallerImage, setSmallerImage] = useState('');
  const [transformControls, setTransformControls] = useState<string[]>(['default']);
  const [transformImages, setTransformImages] = useState<Record<string, string>>({});
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  
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

  const addTransformControl = () => {
    const newId = `transform-${Date.now()}`;
    setTransformControls(prev => [...prev, newId]);
    toast({
      title: "➕ Control Added!",
      description: "New transform control set created",
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
    toast({
      title: "✨ Profile Saved!",
      description: "Your image configuration has been saved",
    });
  };

  const loadProfile = (profile: SavedProfile) => {
    setCurrentMainImage(profile.mainImage);
    setSelectedImage(profile.mainImage);
    setImageSettings(profile.settings);
    setTransformImages(profile.transformImages);
    setSmallerImage(profile.smallerImage);
    toast({
      title: "📁 Profile Loaded!",
      description: `Loaded configuration for ${profile.name}`,
    });
  };

  const deleteProfile = (profileId: string) => {
    setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
    toast({
      title: "🗑️ Profile Deleted!",
      description: "Profile has been removed",
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
    <div className="p-6 space-y-6 h-full overflow-y-auto max-h-screen">
      
      {/* Saved Profiles Section */}
      {savedProfiles.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-purple-100/50 rounded-xl p-4 shadow-lg border border-purple-200/40">
          <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
            <span>📁</span> Saved Profiles
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {savedProfiles.map((profile) => (
              <div key={profile.id} className="flex-shrink-0 relative group">
                <div 
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => loadProfile(profile)}
                >
                  <img
                    src={imageMap[profile.thumbnail] || profile.thumbnail}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-purple-600 mt-1 text-center truncate w-20">{profile.name}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProfile(profile.id);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  size="sm"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
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
      
      {/* Main Upload Section */}
      <div className="flex-shrink-0">
        <div className="relative bg-gradient-to-br from-pink-50 via-purple-50/20 to-pink-100/30 rounded-xl p-4 shadow-lg border border-pink-200/40">
          {currentMainImage ? (
            <>
              <img
                src={imageMap[currentMainImage] || currentMainImage}
                alt="Main character view"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-pink-100/10 rounded-xl" />
            </>
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-md flex flex-col items-center justify-center border-2 border-dashed border-pink-300">
              <Upload className="w-6 h-6 text-pink-500 mb-2" />
              <span className="text-xs font-medium text-pink-600 text-center px-2">Upload main image</span>
            </div>
          )}
          
          {/* Change Main Image Button */}
          <Button
            onClick={triggerMainImageUpload}
            className="absolute top-2 right-2 bg-pink-500/90 hover:bg-pink-600/90 text-white p-1.5 rounded-full shadow-lg backdrop-blur-sm"
            size="sm"
          >
            <Upload className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Main Image Subsection - Only show when main image is uploaded */}
      {currentMainImage && (
        <div className="bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-pink-100/50 rounded-xl p-3 shadow-lg border border-pink-200/40">
          <h3 className="text-base font-semibold text-pink-700 mb-2 flex items-center gap-2">
            <span>🎨</span> Image Configuration
          </h3>
          
          <div className="flex gap-1">
            {/* Main Image Display */}
            <div className="flex-shrink-0">
              <img
                src={imageMap[currentMainImage] || currentMainImage}
                alt="Main image"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Transform Controls */}
            <div className="flex-1 space-y-2">
              {transformControls.map((controlId, index) => {
                const imageKey = `${smallerImage || 'smaller-image-default'}-${controlId}`;
                const settings = getImageSettings(imageKey);
                
                return (
                  <div key={controlId} className="p-1.5 bg-white/40 rounded-lg border border-pink-200/60">
                    <h4 className="text-xs font-medium text-pink-700 mb-1 flex items-center gap-1">
                      Set {index + 1}
                      
                      {/* Individual Image Upload for each Transform Set */}
                      {index > 0 && (
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {transformImages[controlId] ? (
                              <img
                                src={imageMap[transformImages[controlId]] || transformImages[controlId]}
                                alt={`Transform image ${index + 1}`}
                                className="w-12 h-12 object-cover rounded shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-pink-100/50 rounded shadow-md flex items-center justify-center border border-dashed border-pink-300">
                                <Upload className="w-3 h-3 text-pink-500" />
                              </div>
                            )}
                            
                            <Button
                              onClick={() => triggerTransformImageUpload(controlId)}
                              className="absolute -top-0.5 -right-0.5 bg-pink-500/90 hover:bg-pink-600/90 text-white p-0.5 rounded-full shadow-lg backdrop-blur-sm"
                              size="sm"
                            >
                              <Upload className="w-1 h-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Default Smaller Image for First Transform Set */}
                      {index === 0 && (
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {smallerImage ? (
                              <img
                                src={imageMap[smallerImage] || smallerImage}
                                alt="Smaller image"
                                className="w-12 h-12 object-cover rounded shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-pink-100/50 rounded shadow-md flex items-center justify-center border border-dashed border-pink-300">
                                <Upload className="w-3 h-3 text-pink-500" />
                              </div>
                            )}
                            
                            <Button
                              onClick={triggerSmallerImageUpload}
                              className="absolute -top-0.5 -right-0.5 bg-pink-500/90 hover:bg-pink-600/90 text-white p-0.5 rounded-full shadow-lg backdrop-blur-sm"
                              size="sm"
                            >
                              <Upload className="w-1 h-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </h4>
                    
                    <div className="space-y-2">
                      {/* Position Controls */}
                      <div>
                        <p className="font-medium text-pink-700 mb-1 text-xs">Position</p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">x</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600" 
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
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600" 
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
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600"
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
                        <p className="font-medium text-pink-700 mb-1 text-xs">Rotation</p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-600">x</span>
                            <input 
                              type="number"
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600" 
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
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600" 
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
                              className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600"
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
                        <p className="font-medium text-pink-700 mb-1 text-xs">Scale</p>
                        <input 
                          type="number"
                          step="0.1"
                          className="w-20 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none text-pink-600" 
                          value={settings.scale}
                          onChange={(e) => updateImageSettings(imageKey, { 
                            scale: parseFloat(e.target.value) || 1.0 
                          })}
                        />
                      </div>
                      
                      {/* Save Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={() => saveImageSettings(imageKey)}
                          className="bg-pink-500 hover:bg-pink-600 text-white w-12 h-8 rounded-full flex items-center justify-center text-xs"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Add Transform Control Button */}
          <div className="mt-2 flex justify-center gap-2">
            <Button
              onClick={addTransformControl}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs"
            >
              ➕ Add
            </Button>
          </div>
          
          {/* Save Profile Button */}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={saveProfile}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-sm font-medium"
            >
              💾 Save Profile
            </Button>
          </div>
        </div>
      )}
      
      {/* Side Panel with Scrollable Thumbnails */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-pink-700 mb-4 flex items-center gap-2">
          <span>✨</span> Variations
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {currentThumbnails.length > 0 ? currentThumbnails.map((thumbnail, index) => {
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
                    onClick={() => setSelectedImage(thumbnail)}
                  />
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: selectedColor }}
                  />
                  
                  {/* Change Thumbnail Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerThumbnailUpload(index);
                    }}
                    className="absolute -bottom-1 -right-1 bg-pink-500/90 hover:bg-pink-600/90 text-white p-1 rounded-full shadow-lg backdrop-blur-sm"
                    size="sm"
                  >
                    <Upload className="w-3 h-3" />
                  </Button>
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
          }) : (
            <div className="text-center text-pink-500 py-8">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No variations uploaded yet</p>
              <p className="text-xs text-pink-400 mt-1">Upload images to see variations here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};