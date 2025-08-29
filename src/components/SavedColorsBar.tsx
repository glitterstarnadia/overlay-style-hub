import React, { useState } from 'react';
import { Heart, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedColorsBarProps {
  savedColors: string[];
  onColorSelect: (color: string) => void;
  onSaveColor: (color: string) => void;
  currentColor: string;
}

export const SavedColorsBar: React.FC<SavedColorsBarProps> = ({
  savedColors,
  onColorSelect,
  onSaveColor,
  currentColor,
}) => {
  const { toast } = useToast();

  const copyToClipboard = (hexColor: string) => {
    navigator.clipboard.writeText(hexColor);
    toast({
      title: "💖 Color Copied!",
      description: `${hexColor} is now in your clipboard`,
    });
  };

  const handleColorClick = (color: string) => {
    onColorSelect(color);
    copyToClipboard(color);
  };

  const handleSaveClick = () => {
    if (!savedColors.includes(currentColor) && savedColors.length < 20) {
      onSaveColor(currentColor);
      toast({
        title: "✨ Color Saved!",
        description: `${currentColor} added to your favorites`,
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-pink-100/90 via-purple-100/90 to-pink-100/90 backdrop-blur-sm border-t border-pink-200/60 p-3">
      <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
        {/* Save Current Color Button */}
        <button
          onClick={handleSaveClick}
          className="flex items-center gap-2 px-3 py-2 bg-pink-200/50 hover:bg-pink-200/70 rounded-full border border-pink-300/50 transition-all duration-200 text-pink-700 hover:text-pink-800 text-sm font-medium"
          disabled={savedColors.includes(currentColor) || savedColors.length >= 20}
        >
          <Heart className="w-4 h-4" />
          Save Color
        </button>

        {/* Saved Colors */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {savedColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorClick(color)}
              className="relative group"
              title={`${color} - Click to use & copy`}
            >
              {/* Heart Shape */}
              <div 
                className="w-8 h-8 relative transform rotate-45 hover:scale-110 transition-all duration-300 hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: color }}
              >
                <div 
                  className="absolute -left-1 -top-1 w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div 
                  className="absolute -right-1 -top-1 w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
              
              {/* Copy Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="w-3 h-3 text-white/90 drop-shadow-md" />
              </div>
            </button>
          ))}

          {/* Empty slots indicator */}
          {savedColors.length < 20 && (
            <div className="text-xs text-pink-500/60 ml-2">
              {20 - savedColors.length} more slots available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};