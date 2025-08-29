import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ColorPickerPanelProps {
  color: string;
  onChange: (color: string) => void;
}

const presetColors = [
  '#8b5cf6', '#ef4444', '#f59e0b', '#10b981',
  '#3b82f6', '#ec4899', '#6366f1', '#84cc16',
  '#f97316', '#06b6d4', '#8b5a2b', '#1f2937',
];

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  color,
  onChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.match(/^#[0-9A-F]{6}$/i)) {
      onChange(value);
    }
  };

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