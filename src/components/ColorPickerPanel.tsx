import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Copy, Heart, Save, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Color utility functions
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

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

  const handleDarknessChange = (values: number[]) => {
    const lightness = values[0];
    const [h, s] = hexToHsl(color);
    const newColor = hslToHex(h, s, lightness);
    onChange(newColor);
  };

  const getCurrentLightness = () => {
    const [, , l] = hexToHsl(color);
    return l;
  };

  if (compact) {
    return (
      <div className="space-y-4 p-4 bg-gradient-to-b from-pink-50/50 to-purple-50/50 rounded-lg border border-pink-200/50">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-500" />
          <Label className="text-sm font-medium text-pink-700">Magic Colors</Label>
        </div>
        
        {/* Hex Input Field */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-pink-600">Enter Hex Code</Label>
          <Input
            type="text"
            value={color}
            onChange={handleInputChange}
            className="text-sm font-mono bg-white/80 border-pink-200 focus:border-pink-400 text-center"
            placeholder="#000000"
          />
        </div>

        {/* Current Color Display */}
        <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
          <div
            className="w-10 h-10 rounded-full border-2 border-pink-200 shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => copyToClipboard(color)}
            title="Click to copy"
          />
          <div className="flex-1">
            <p className="text-sm font-mono text-pink-700">{color}</p>
            <p className="text-xs text-pink-600">Current Color</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={saveCurrentColor}
            className="text-pink-500 hover:text-pink-600 hover:bg-pink-100"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>

        {/* Color Picker - Bigger */}
        <div className="relative">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ 
              width: '100%', 
              height: '160px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        {/* Darkness Slider */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-pink-600">Darkness</Label>
          <div className="px-2">
            <Slider
              value={[getCurrentLightness()]}
              onValueChange={handleDarknessChange}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-pink-500">
            <span>Dark</span>
            <span>Light</span>
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <Label className="text-xs font-medium text-pink-600 mb-2 block">Preset Colors</Label>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => {
                  onChange(presetColor);
                  copyToClipboard(presetColor);
                }}
                className="w-8 h-8 rounded-full border-2 border-pink-200 hover:scale-110 hover:shadow-lg transition-all duration-200 relative group"
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              >
                <Heart className="w-3 h-3 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 m-auto" />
              </button>
            ))}
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

        {/* Darkness Slider */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Darkness</Label>
          <div className="px-1">
            <Slider
              value={[getCurrentLightness()]}
              onValueChange={handleDarknessChange}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground/70">
            <span>Dark</span>
            <span>Light</span>
          </div>
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