import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeartColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  savedColors: string[];
  onSaveColor: (color: string) => void;
  onDeleteColor: (index: number) => void;
}

export const HeartColorPicker: React.FC<HeartColorPickerProps> = ({
  currentColor, 
  onColorSelect, 
  savedColors, 
  onSaveColor,
  onDeleteColor 
}) => {
  const [hexInput, setHexInput] = useState(currentColor);
  const [scaleHexInput, setScaleHexInput] = useState('#ffffff');
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

  useEffect(() => {
    setHexInput(currentColor);
    setRgbValues(hexToRgb(currentColor));
  }, [currentColor]);

  const handleColorChange = (color: string) => {
    setHexInput(color);
    setRgbValues(hexToRgb(color));
    onColorSelect(color);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      handleColorChange(value);
    }
  };

  const handleScaleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScaleHexInput(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      toast({
        title: "Scale Color Updated",
        description: `Scale hex set to ${value}`,
      });
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [component]: Math.max(0, Math.min(255, value)) };
    setRgbValues(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex);
    onColorSelect(hex);
  };

  const saveCurrentColor = () => {
    if (!savedColors.includes(currentColor)) {
      onSaveColor(currentColor);
      toast({
        title: "💖 Color Saved!",
        description: `${currentColor} added to your palette`,
      });
    }
  };

  const deleteColor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteColor(index);
    toast({
      title: "🗑️ Color Removed",
      description: "Color deleted from your palette",
    });
  };

  const HeartIcon = ({ color, onClick, isAddButton = false, onDelete, index }: { 
    color?: string; 
    onClick: () => void; 
    isAddButton?: boolean;
    onDelete?: (index: number, e: React.MouseEvent) => void;
    index?: number;
  }) => (
    <div className="relative group">
      <button
        onClick={onClick}
        className="relative transition-transform hover:scale-110 duration-200"
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
      {!isAddButton && onDelete && typeof index === 'number' && (
        <button
          onClick={(e) => onDelete(index, e)}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-t from-pink-200 via-pink-100 to-pink-50 p-4 border-t-4 border-pink-300">
      <div className="flex gap-6">
        {/* Color Wheel Section */}
        <div className="flex-shrink-0">
          <HexColorPicker
            color={currentColor}
            onChange={handleColorChange}
            style={{ 
              width: '280px', 
              height: '180px',
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

          <div>
            <Label className="text-xs font-bold text-pink-600 mb-1 block">Scale HEX</Label>
            <Input
              type="text"
              value={scaleHexInput}
              onChange={handleScaleHexChange}
              className="w-full h-8 text-center bg-white border-2 border-pink-300 text-pink-700 font-mono font-bold"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Heart Color Palette */}
        <div className="flex-1">
          <div className="grid grid-cols-8 gap-2">
            {/* Add button */}
            <HeartIcon onClick={saveCurrentColor} isAddButton />
            
            {/* Color hearts */}
            {savedColors.map((color, index) => (
              <HeartIcon
                key={index}
                color={color}
                onClick={() => handleColorChange(color)}
                onDelete={deleteColor}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};