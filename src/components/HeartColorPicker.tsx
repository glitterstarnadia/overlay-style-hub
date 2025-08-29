import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeartColorPickerProps {
  onColorSelect?: (color: string) => void;
}

const defaultColors = [
  '#ffb3ba', '#ffb3d6', '#d6b3ff', '#b3d6ff', '#b3ffb3', '#ffffb3', '#ffcc99',
  '#ff9999', '#ff66b3', '#b366ff', '#66b3ff', '#66ff66', '#ffff66', '#ff9966',
  '#ff6666', '#ff3399', '#9933ff', '#3399ff', '#33ff33', '#ffff33', '#ff6633',
  '#ff3333', '#ff0066', '#6600ff', '#0066ff', '#00ff00', '#ffff00', '#ff3300',
  '#ff0000', '#cc0066', '#3300ff', '#0033ff', '#00cc00', '#cccc00', '#cc3300'
];

export const HeartColorPicker: React.FC<HeartColorPickerProps> = ({ onColorSelect }) => {
  const [currentColor, setCurrentColor] = useState('#ff69b4');
  const [savedColors, setSavedColors] = useState<string[]>(defaultColors);
  const [hexInput, setHexInput] = useState('#ff69b4');
  const [rgbValues, setRgbValues] = useState({ r: 255, g: 105, b: 180 });
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 105, b: 180 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setHexInput(color);
    setRgbValues(hexToRgb(color));
    onColorSelect?.(color);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      handleColorChange(value);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [component]: Math.max(0, Math.min(255, value)) };
    setRgbValues(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(hex);
    setHexInput(hex);
    onColorSelect?.(hex);
  };

  const saveCurrentColor = () => {
    if (!savedColors.includes(currentColor)) {
      setSavedColors([...savedColors, currentColor]);
      toast({
        title: "💖 Color Saved!",
        description: `${currentColor} added to your palette`,
      });
    }
  };

  const HeartIcon = ({ color, onClick, isAddButton = false }: { 
    color?: string; 
    onClick: () => void; 
    isAddButton?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="relative group transition-transform hover:scale-110 duration-200"
    >
      <Heart
        className={`w-8 h-8 transition-all duration-200 ${
          isAddButton 
            ? 'text-pink-300 hover:text-pink-400 fill-pink-100 hover:fill-pink-200' 
            : 'text-white hover:text-pink-100'
        }`}
        style={!isAddButton ? { 
          fill: color,
          stroke: '#ffffff',
          strokeWidth: 2
        } : {}}
      />
      {isAddButton && (
        <Plus className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500" />
      )}
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-pink-200 via-pink-100 to-pink-50 p-6 border-t-4 border-pink-300 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          {/* Color Wheel Section */}
          <div className="flex-shrink-0">
            <HexColorPicker
              color={currentColor}
              onChange={handleColorChange}
              style={{ 
                width: '200px', 
                height: '120px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </div>

          {/* RGB/HEX Controls */}
          <div className="flex-shrink-0 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-bold text-pink-600 mb-1 block">R</Label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.r}
                  onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center bg-white border-2 border-pink-300 text-pink-700 font-bold"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-pink-600 mb-1 block">G</Label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.g}
                  onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center bg-white border-2 border-pink-300 text-pink-700 font-bold"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-pink-600 mb-1 block">B</Label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.b}
                  onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center bg-white border-2 border-pink-300 text-pink-700 font-bold"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-pink-600 mb-1 block">HEX</Label>
              <Input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                className="w-full h-8 text-center bg-white border-2 border-pink-300 text-pink-700 font-mono font-bold"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Heart Color Palette */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-3 max-w-md">
              {/* Add button */}
              <HeartIcon onClick={saveCurrentColor} isAddButton />
              
              {/* Color hearts */}
              {savedColors.map((color, index) => (
                <HeartIcon
                  key={index}
                  color={color}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};