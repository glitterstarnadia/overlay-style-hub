import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings, Move, MoreVertical, RotateCcw, Download, Upload, Palette, Pin, Eye } from 'lucide-react';
import { SectionPanel } from './SectionPanel';
import { ColorPickerPanel } from './ColorPickerPanel';
import { SettingsMenu } from './SettingsMenu';
import { SparkleEffect } from './SparkleEffect';
import { HeartColorPicker } from './HeartColorPicker';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CustomizationOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

const sections = [
  { id: 'hair', title: 'Hair' },
  { id: 'patterns', title: 'Patterns' },
  { id: 'colours', title: 'Colours' },
  { id: 'tops', title: 'Tops' },
  { id: 'dresses', title: 'Dresses' },
  { id: 'pants', title: 'Pants' },
  { id: 'shoes', title: 'Shoes' },
  { id: 'adjustments', title: 'Adjustments' },
];

export const CustomizationOverlay: React.FC<CustomizationOverlayProps> = ({
  isVisible,
  onToggle,
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Settings state
  const [opacity, setOpacity] = useState(100);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [savedColors, setSavedColors] = useState<string[]>([
    '#ffb3ba', '#ffb3d6', '#d6b3ff', '#b3d6ff', '#b3ffb3', '#ffffb3', '#ffcc99',
    '#ff9999', '#ff66b3', '#b366ff', '#66b3ff', '#66ff66', '#ffff66', '#ff9966'
  ]);
  
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  // Settings handlers
  const resetPositionAndSize = () => {
    setPosition({ x: 50, y: 50 });
    setSize({ width: 800, height: 600 });
    toast({
      title: "Window Reset",
      description: "Position and size have been reset to default.",
    });
  };

  const exportConfiguration = () => {
    const config = {
      activeSection,
      selectedColor,
      position,
      size,
      opacity,
      alwaysOnTop,
      theme,
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'character-config.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Configuration Exported",
      description: "Your settings have been saved to a file.",
    });
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setActiveSection(config.activeSection);
          setSelectedColor(config.selectedColor);
          setPosition(config.position);
          setSize(config.size);
          setOpacity(config.opacity);
          setAlwaysOnTop(config.alwaysOnTop);
          setTheme(config.theme);
          
          toast({
            title: "Configuration Imported",
            description: "Your settings have been restored successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to import configuration file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
      if (isResizing) {
        const newWidth = Math.max(600, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(400, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 ease-smooth"
        size="lg"
      >
        <Settings className="w-5 h-5 mr-2" />
        Customize
      </Button>
    );
  }

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed select-none transition-all duration-300 ease-smooth",
        (isDragging || isResizing) ? "cursor-grabbing" : "cursor-grab",
        theme === 'dark' ? 'dark' : ''
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: alwaysOnTop ? 9999 : 50,
        opacity: opacity / 100,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="bg-gradient-to-br from-pink-50/95 to-purple-100/95 backdrop-blur-lg border-pink-200/60 shadow-xl w-full h-full overflow-hidden relative magic-cursor">
        {/* Header */}
        <div
          data-drag-handle
          className="flex items-center justify-between p-4 border-b border-overlay-border bg-gradient-surface cursor-move"
        >
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          </div>
          <div className="flex items-center gap-2">
            <SettingsMenu
              opacity={opacity}
              onOpacityChange={setOpacity}
              alwaysOnTop={alwaysOnTop}
              onAlwaysOnTopChange={setAlwaysOnTop}
              theme={theme}
              onThemeChange={setTheme}
              onResetPosition={resetPositionAndSize}
              onExportConfig={exportConfiguration}
              onImportConfig={importConfiguration}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="hover:bg-overlay-hover text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-48 bg-overlay-surface/50 border-r border-overlay-border flex flex-col">
            <nav className="p-2 flex-1 overflow-y-auto max-h-full">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => 
                      setActiveSection(activeSection === section.id ? null : section.id)
                    }
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-overlay-hover hover:text-foreground",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </nav>
            
            {/* Always visible color picker */}
            <div className="p-2 border-t border-overlay-border">
              <ColorPickerPanel
                color={selectedColor}
                onChange={setSelectedColor}
                compact={true}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0">
            {activeSection ? (
              <SectionPanel
                sectionId={activeSection}
                sectionTitle={sections.find(s => s.id === activeSection)?.title || ''}
                selectedColor={selectedColor}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a section from the left to customize your character
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Resize Handle */}
        <div
          className="absolute bottom-2 right-2 w-6 h-6 cursor-nw-resize bg-pink-400/30 hover:bg-pink-400/50 transition-colors rounded-full flex items-center justify-center"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        >
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
        </div>
      </Card>
      <SparkleEffect />
      
      {/* Heart Color Picker */}
      <HeartColorPicker
        currentColor={selectedColor}
        onColorSelect={setSelectedColor}
        savedColors={savedColors}
        onSaveColor={(color) => setSavedColors(prev => [...prev, color])}
        onDeleteColor={(index) => setSavedColors(prev => prev.filter((_, i) => i !== index))}
      />
    </div>
  );
};