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
          className="w-72 bg-overlay-bg border-overlay-border"
        >
          <DropdownMenuLabel className="text-foreground">Settings</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-overlay-border" />
          
          {/* Window Opacity */}
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm text-foreground">
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
          
          <DropdownMenuSeparator className="bg-overlay-border" />
          
          {/* Always on Top */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm text-foreground">Always on Top</Label>
              </div>
              <Switch
                checked={alwaysOnTop}
                onCheckedChange={onAlwaysOnTopChange}
              />
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-overlay-border" />
          
          {/* Theme Toggle */}
          <DropdownMenuItem 
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="cursor-pointer hover:bg-overlay-hover"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-overlay-border" />
          
          {/* Reset Position */}
          <DropdownMenuItem 
            onClick={onResetPosition}
            className="cursor-pointer hover:bg-overlay-hover"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Reset Position & Size</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-overlay-border" />
          
          {/* Export All Profiles */}
          <DropdownMenuItem 
            onClick={onExportAllProfiles}
            className="cursor-pointer hover:bg-overlay-hover"
          >
            <div className="flex items-center gap-2">
              <FolderDown className="w-4 h-4" />
              <span>Export All Profiles</span>
            </div>
          </DropdownMenuItem>
          
          {/* Import All Profiles */}
          <DropdownMenuItem 
            onClick={handleProfileImportClick}
            className="cursor-pointer hover:bg-overlay-hover"
          >
            <div className="flex items-center gap-2">
              <FolderUp className="w-4 h-4" />
              <span>Import All Profiles</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-overlay-border" />
          
          {/* Export Configuration */}
          <DropdownMenuItem 
            onClick={onExportConfig}
            className="cursor-pointer hover:bg-overlay-hover"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Export Configuration</span>
            </div>
          </DropdownMenuItem>
          
          {/* Import Configuration */}
          <DropdownMenuItem 
            onClick={handleImportClick}
            className="cursor-pointer hover:bg-overlay-hover"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Import Configuration</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};