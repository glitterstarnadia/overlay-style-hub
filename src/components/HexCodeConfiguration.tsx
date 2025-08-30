import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HexCodeSet {
  id: string;
  name: string;
  colors: string[];
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

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...currentSet.colors];
    newColors[index] = value;
    setCurrentSet(prev => ({
      ...prev,
      colors: newColors
    }));
  };

  const handleSave = () => {
    // Save the current set to localStorage
    const savedSets = JSON.parse(localStorage.getItem(`hex-sets-${category}`) || '[]');
    const existingIndex = savedSets.findIndex((set: HexCodeSet) => set.id === currentSet.id);
    
    if (existingIndex >= 0) {
      savedSets[existingIndex] = currentSet;
    } else {
      savedSets.push(currentSet);
    }
    
    localStorage.setItem(`hex-sets-${category}`, JSON.stringify(savedSets));
    
    toast({
      title: "Saved!",
      description: `${currentSet.name} has been saved successfully.`
    });
  };

  const handleAdd = () => {
    // Add a new set
    const savedSets = JSON.parse(localStorage.getItem(`hex-sets-${category}`) || '[]');
    const newId = (savedSets.length + 1).toString();
    const newSet: HexCodeSet = {
      id: newId,
      name: `Set ${newId}`,
      colors: ['#ffffff', '#ffffff', '#ffffff']
    };
    
    savedSets.push(newSet);
    localStorage.setItem(`hex-sets-${category}`, JSON.stringify(savedSets));
    setCurrentSet(newSet);
    
    toast({
      title: "New Set Added!",
      description: `${newSet.name} has been created.`
    });
  };

  return (
    <div className="h-full bg-white rounded-lg border-2 border-pink-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-3 border-b-2 border-pink-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <h3 className="text-lg font-bold text-pink-600">Image Configuration</h3>
        </div>
        <Button
          onClick={handleSave}
          className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-full"
        >
          Save
        </Button>
      </div>

      {/* Content */}
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
      <div className="p-6 pt-0 flex justify-center">
        <Button
          onClick={handleAdd}
          variant="outline"
          className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
    </div>
  );
};