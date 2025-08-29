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
  const [rgbValues, setRgbValues] = useState({
    r: 255,
    g: 105,
    b: 180
  });
  const {
    toast
  } = useToast();
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
      r: 255,
      g: 105,
      b: 180
    };
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
        description: `Scale hex set to ${value}`
      });
    }
  };
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = {
      ...rgbValues,
      [component]: Math.max(0, Math.min(255, value))
    };
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
        description: `${currentColor} added to your palette`
      });
    }
  };
  const deleteColor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteColor(index);
    toast({
      title: "🗑️ Color Removed",
      description: "Color deleted from your palette"
    });
  };
  const HeartIcon = ({
    color,
    onClick,
    isAddButton = false,
    onDelete,
    index
  }: {
    color?: string;
    onClick: () => void;
    isAddButton?: boolean;
    onDelete?: (index: number, e: React.MouseEvent) => void;
    index?: number;
  }) => <div className="relative group">
      <button onClick={onClick} className="relative transition-transform hover:scale-110 duration-200">
        <Heart className={`w-8 h-8 transition-all duration-200 ${isAddButton ? 'text-pink-300 hover:text-pink-400 fill-pink-100 hover:fill-pink-200' : 'text-white hover:text-pink-100'}`} style={!isAddButton ? {
        fill: color,
        stroke: '#ffffff',
        strokeWidth: 2
      } : {}} />
        {isAddButton && <Plus className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500" />}
      </button>
      {!isAddButton && onDelete && typeof index === 'number' && <button onClick={e => onDelete(index, e)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600">
          <X className="w-2.5 h-2.5" />
        </button>}
    </div>;
  return (
    <div className="space-y-6">
      {/* Main Color Picker */}
      <div className="flex flex-col items-center space-y-4">
        <HexColorPicker color={currentColor} onChange={handleColorChange} />
        
        {/* Hex Input */}
        <div className="w-full">
          <Label htmlFor="hex-input">Hex Color</Label>
          <Input
            id="hex-input"
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            placeholder="#FF69B4"
            className="mt-1"
          />
        </div>

        {/* RGB Controls */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div>
            <Label htmlFor="r-input">R</Label>
            <Input
              id="r-input"
              type="number"
              min="0"
              max="255"
              value={rgbValues.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="g-input">G</Label>
            <Input
              id="g-input"
              type="number"
              min="0"
              max="255"
              value={rgbValues.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="b-input">B</Label>
            <Input
              id="b-input"
              type="number"
              min="0"
              max="255"
              value={rgbValues.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Scale Hex Input */}
        <div className="w-full">
          <Label htmlFor="scale-hex">Scale Hex</Label>
          <Input
            id="scale-hex"
            type="text"
            value={scaleHexInput}
            onChange={handleScaleHexChange}
            placeholder="#FFFFFF"
            className="mt-1"
          />
        </div>
      </div>

      {/* Saved Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Saved Colors</Label>
          <Button onClick={saveCurrentColor} size="sm" variant="outline">
            Save Current
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <HeartIcon
            onClick={saveCurrentColor}
            isAddButton={true}
          />
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
  );
};