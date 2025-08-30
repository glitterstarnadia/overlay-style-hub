import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Copy, Heart, Save, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorPickerPanelProps {
  color: string;
  onChange: (color: string) => void;
  compact?: boolean;
}

const presetColors = [
  '#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#ff91a4',
  '#dda0dd', '#da70d6', '#ba55d3', '#9370db', '#8b5cf6',
  '#f8bbd9', '#f5c2c7', '#fde2e7', '#fecaca', '#fed7d7',
  '#e9d5ff', '#c7d2fe', '#bfdbfe', '#a7f3d0', '#86efac',
];

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  color,
  onChange,
  compact = false,
}) => {
  const { toast } = useToast();
  const [savedColors, setSavedColors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
      onChange(value);
    }
  };

  const copyToClipboard = (hexColor: string) => {
    navigator.clipboard.writeText(hexColor);
    toast({
      title: "💖 Color Copied!",
      description: `${hexColor} is now in your clipboard`,
    });
  };

  const saveCurrentColor = () => {
    if (!savedColors.includes(color) && savedColors.length < 20) {
      setSavedColors([...savedColors, color]);
      toast({
        title: "✨ Color Saved!",
        description: `${color} added to your favorites`,
      });
    }
  };

  const handleSavedColorClick = (savedColor: string) => {
    onChange(savedColor);
    copyToClipboard(savedColor);
  };

  if (compact) {
    return (
      <div className="space-y-3 p-3 bg-gradient-to-b from-pink-50/50 to-purple-50/50 rounded-lg border border-pink-200/50 w-full">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-500" />
          <Label className="text-sm font-medium text-pink-700">Magic Colors</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Hex Input Field */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-pink-600">Enter Hex Code</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={color}
                  onChange={handleInputChange}
                  className="text-sm font-mono bg-white/80 border-pink-200 focus:border-pink-400 text-center h-8 flex-1"
                  placeholder="#000000"
                />
                <Heart 
                  className="w-5 h-5 flex-shrink-0 drop-shadow-sm" 
                  style={{ 
                    fill: color, 
                    stroke: '#ec4899', 
                    strokeWidth: 1.5 
                  }} 
                />
              </div>
            </div>

            {/* Current Color Display */}
            <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
              <div
                className="w-8 h-8 rounded-full border-2 border-pink-200 shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color)}
                title="Click to copy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-pink-700 truncate">{color}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={saveCurrentColor}
                className="text-pink-500 hover:text-pink-600 hover:bg-pink-100 flex-shrink-0 h-7 w-7 p-0"
              >
                <Save className="w-3 h-3" />
              </Button>
            </div>

            {/* Preset Colors */}
            <div>
              <Label className="text-xs font-medium text-pink-600 mb-2 block">Presets</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {presetColors.slice(0, 8).map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => {
                      onChange(presetColor);
                      copyToClipboard(presetColor);
                    }}
                    className="w-6 h-6 rounded-full border border-pink-200 hover:scale-110 hover:shadow-lg transition-all duration-200"
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Color Picker */}
          <div className="flex items-center justify-center">
            <HexColorPicker
              color={color}
              onChange={onChange}
              style={{ 
                width: '120px', 
                height: '120px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-overlay-surface/30 border-overlay-border">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-foreground">Color Picker</Label>
        
        {/* Color Picker */}
        <div className="w-full">
          <HexColorPicker
            color={color}
            onChange={onChange}
            className="!w-full !h-32"
          />
        </div>

        {/* Hex Input */}
        <div className="space-y-2">
          <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
            Hex Code
          </Label>
          <Input
            id="hex-input"
            value={color}
            onChange={handleInputChange}
            className="bg-overlay-bg border-overlay-border text-foreground text-sm"
            placeholder="#000000"
          />
        </div>

        {/* Color Preview */}
        <div
          className="w-full h-8 rounded-md border border-overlay-border"
          style={{ backgroundColor: color }}
        />

        {/* Preset Colors */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Presets</Label>
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((presetColor) => (
              <Button
                key={presetColor}
                variant="ghost"
                className="p-1 h-8 w-8 rounded-md border border-overlay-border hover:border-overlay-active/50"
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};