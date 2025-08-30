import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HexCodeSet {
  id: string;
  name: string;
  colors: string[];
}

interface SavedProfile {
  id: string;
  name: string;
  hexSets: HexCodeSet[];
  createdAt: string;
}

interface HexCodeConfigurationProps {
  category: string;
  previewImage: string;
}

export const HexCodeConfiguration: React.FC<HexCodeConfigurationProps> = ({
  category,
  previewImage,
}) => {
  const { toast } = useToast();
  const [currentSet, setCurrentSet] = useState<HexCodeSet>({
    id: '1',
    name: 'Set 1',
    colors: ['#ffffff', '#ffffff', '#ffffff']
  });

  // Load saved profiles from localStorage
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(() => {
    const saved = localStorage.getItem(`saved-profiles-${category}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Save profiles to localStorage whenever savedProfiles changes
  useEffect(() => {
    localStorage.setItem(`saved-profiles-${category}`, JSON.stringify(savedProfiles));
  }, [savedProfiles, category]);

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...currentSet.colors];
    newColors[index] = value;
    setCurrentSet(prev => ({
      ...prev,
      colors: newColors
    }));
  };

  const createNewProfile = () => {
    const newProfile: SavedProfile = {
      id: `profile-${Date.now()}`,
      name: `Profile ${savedProfiles.length + 1}`,
      hexSets: [{ ...currentSet }],
      createdAt: new Date().toISOString()
    };

    setSavedProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    
    toast({
      title: "✨ New Profile Created!",
      description: "A new profile has been created and saved."
    });
  };

  const saveCurrentProfile = () => {
    if (activeProfileId) {
      // Update existing profile
      setSavedProfiles(prev => prev.map(profile => 
        profile.id === activeProfileId 
          ? { ...profile, hexSets: [{ ...currentSet }] }
          : profile
      ));
      toast({
        title: "💾 Profile Updated!",
        description: "Your profile has been updated successfully."
      });
    } else {
      createNewProfile();
    }
  };

  const loadProfile = (profile: SavedProfile) => {
    if (profile.hexSets && profile.hexSets.length > 0) {
      setCurrentSet(profile.hexSets[0]);
    }
    setActiveProfileId(profile.id);
    
    toast({
      title: "📁 Profile Loaded!",
      description: `Loaded configuration for ${profile.name}`
    });
  };

  const deleteProfile = (profileId: string) => {
    setSavedProfiles(prev => prev.filter(profile => profile.id !== profileId));
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
    }
    
    toast({
      title: "🗑️ Profile Deleted",
      description: "Profile has been removed successfully."
    });
  };

  const startEditingName = (profile: SavedProfile) => {
    setEditingProfileId(profile.id);
    setEditingName(profile.name);
  };

  const saveProfileName = () => {
    setSavedProfiles(prev => prev.map(profile =>
      profile.id === editingProfileId
        ? { ...profile, name: editingName }
        : profile
    ));
    setEditingProfileId(null);
    setEditingName('');
  };

  const cancelEditingName = () => {
    setEditingProfileId(null);
    setEditingName('');
  };

  const handleAdd = () => {
    // Add a new set
    const newId = (Date.now()).toString();
    const newSet: HexCodeSet = {
      id: newId,
      name: `Set ${Date.now() % 1000}`,
      colors: ['#ffffff', '#ffffff', '#ffffff']
    };
    
    setCurrentSet(newSet);
    
    toast({
      title: "New Set Added!",
      description: `${newSet.name} has been created.`
    });
  };

  return (
    <div className="h-full bg-white rounded-lg border-2 border-pink-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-3 border-b-2 border-pink-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <h3 className="text-lg font-bold text-pink-600">Image Configuration</h3>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={createNewProfile}
            className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm"
          >
            + New Profile
          </Button>
          <Button
            onClick={saveCurrentProfile}
            className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm"
          >
            💾 Save Profile
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 flex gap-6">
          {/* Preview Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-pink-200 bg-gradient-to-br from-pink-100 to-purple-100 relative">
              <img 
                src={previewImage} 
                alt={currentSet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-sm font-medium text-pink-600">
                {currentSet.name}
              </div>
            </div>
          </div>

          {/* Hex Code Inputs */}
          <div className="flex-1 space-y-4">
            {currentSet.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-sm font-medium text-pink-600 min-w-[80px]">
                  Hex Code
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="flex-1 border-pink-200 focus:border-pink-400"
                    placeholder="#ffffff"
                  />
                  <Heart 
                    className="w-6 h-6 text-pink-400 fill-pink-400 flex-shrink-0" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <div className="px-6 pb-4 flex justify-center">
          <Button
            onClick={handleAdd}
            variant="outline"
            className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Saved Profiles Section */}
        {savedProfiles.length > 0 && (
          <div className="border-t-2 border-pink-200 bg-pink-50/50 flex-1 overflow-hidden">
            <div className="p-4">
              <h4 className="text-md font-semibold text-pink-600 mb-3">Saved Profiles</h4>
              <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-40">
                {savedProfiles.map(profile => (
                  <div 
                    key={profile.id} 
                    className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      activeProfileId === profile.id 
                        ? 'border-pink-400 bg-pink-100' 
                        : 'border-pink-200 bg-white hover:border-pink-300'
                    }`}
                    onClick={() => loadProfile(profile)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <img 
                        src={previewImage} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Profile Name */}
                    <div className="p-2 text-center">
                      {editingProfileId === profile.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-xs h-6 px-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveProfileName();
                              if (e.key === 'Escape') cancelEditingName();
                            }}
                          />
                          <Button size="sm" variant="ghost" onClick={saveProfileName} className="h-6 w-6 p-0">
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditingName} className="h-6 w-6 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-pink-600 truncate">{profile.name}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingName(profile);
                        }}
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProfile(profile.id);
                        }}
                        className="h-6 w-6 p-0 bg-red-400/80 hover:bg-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};