import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Upload, 
  Palette, 
  Pin, 
  Eye,
  Sun,
  Moon,
  Database,
  FolderDown,
  FolderUp
} from 'lucide-react';

interface SettingsMenuProps {
  opacity: number;
  onOpacityChange: (value: number) => void;
  alwaysOnTop: boolean;
  onAlwaysOnTopChange: (value: boolean) => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  onResetPosition: () => void;
  onExportConfig: () => void;
  onImportConfig: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportAllProfiles: () => void;
  onImportAllProfiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  opacity,
  onOpacityChange,
  alwaysOnTop,
  onAlwaysOnTopChange,
  theme,
  onThemeChange,
  onResetPosition,
  onExportConfig,
  onImportConfig,
  onExportAllProfiles,
  onImportAllProfiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImportRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImportClick = () => {
    profileImportRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onImportConfig}
        style={{ display: 'none' }}
      />
      
      <input
        ref={profileImportRef}
        type="file"
        accept=".json"
        onChange={onImportAllProfiles}
        style={{ display: 'none' }}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-overlay-hover text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-72 bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg"
        >
          <DropdownMenuLabel className="text-pink-600 font-bold">Settings</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-pink-200" />
          
          {/* Window Opacity */}
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-pink-500" />
              <Label className="text-sm text-pink-600 font-medium">
                Opacity: {opacity}%
              </Label>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={(value) => onOpacityChange(value[0])}
              max={100}
              min={20}
              step={5}
              className="w-full"
            />
          </div>
          
          <DropdownMenuSeparator className="bg-pink-200" />
          
          {/* Always on Top */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-pink-500" />
                <Label className="text-sm text-pink-600 font-medium">Always on Top</Label>
              </div>
              <Switch
                checked={alwaysOnTop}
                onCheckedChange={onAlwaysOnTopChange}
              />
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-pink-200" />
          
          {/* Theme Toggle */}
          <DropdownMenuItem 
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="cursor-pointer hover:bg-pink-100 text-pink-600"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-pink-500" />
              ) : (
                <Moon className="w-4 h-4 text-pink-500" />
              )}
              <span className="font-medium">Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-pink-200" />
          
          {/* Reset Position */}
          <DropdownMenuItem 
            onClick={onResetPosition}
            className="cursor-pointer hover:bg-pink-100 text-pink-600"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Reset Position & Size</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-pink-200" />
          
          {/* Export All Profiles */}
          <DropdownMenuItem 
            onClick={onExportAllProfiles}
            className="cursor-pointer hover:bg-pink-100 text-pink-600"
          >
            <div className="flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Export All Profiles</span>
            </div>
          </DropdownMenuItem>
          
          {/* Import All Profiles */}
          <DropdownMenuItem 
            onClick={handleProfileImportClick}
            className="cursor-pointer hover:bg-pink-100 text-pink-600"
          >
            <div className="flex items-center gap-2">
              <FolderUp className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Import All Profiles</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-pink-200" />
          
          {/* Export Configuration */}
          <DropdownMenuItem 
            onClick={onExportConfig}
            className="cursor-pointer hover:bg-pink-100 text-pink-600"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Export Configuration</span>
            </div>
          </DropdownMenuItem>
          
          {/* Import Configuration */}
          <DropdownMenuItem 
            onClick={handleImportClick}
            className="cursor-pointer hover:bg-pink-100 text-pink-600"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Import Configuration</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};