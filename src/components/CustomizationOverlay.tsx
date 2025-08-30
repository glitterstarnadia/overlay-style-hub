import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings, Move, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionPanel } from './SectionPanel';
import { SettingsMenu } from './SettingsMenu';
import { SparkleEffect } from './SparkleEffect';
import { HeartColorPicker } from './HeartColorPicker';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
interface CustomizationOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
  pageKey?: string;
}
export const CustomizationOverlay: React.FC<CustomizationOverlayProps> = ({
  isVisible,
  onToggle,
  pageKey = 'default'
}) => {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);

  const sections = ['hair', 'patterns', 'colours', 'tops', 'dresses', 'pants', 'shoes', 'adjustments'];
  const [position, setPosition] = useState({
    x: 50,
    y: 50
  });
  const [size, setSize] = useState({
    width: 800,
    height: 600
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  // Settings state - using pageKey to isolate state per page
  const [opacity, setOpacity] = useState(() => {
    const saved = localStorage.getItem(`customization-opacity-${pageKey}`);
    return saved ? parseInt(saved) : 100;
  });
  const [alwaysOnTop, setAlwaysOnTop] = useState(() => {
    const saved = localStorage.getItem(`customization-alwaysOnTop-${pageKey}`);
    return saved ? JSON.parse(saved) : false;
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(`customization-theme-${pageKey}`);
    return saved ? saved as 'dark' | 'light' : 'dark';
  });
  const [savedColors, setSavedColors] = useState<string[]>(() => {
    const saved = localStorage.getItem(`customization-colors-${pageKey}`);
    return saved ? JSON.parse(saved) : ['#ffb3ba', '#ffb3d6', '#d6b3ff', '#b3d6ff', '#b3ffb3', '#ffffb3', '#ffcc99', '#ff9999', '#ff66b3', '#b366ff', '#66b3ff', '#66ff66', '#ffff66', '#ff9966'];
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
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
      height: size.height
    });
  };

  const toggleAllSections = () => {
    if (allCollapsed) {
      // Expand all
      setCollapsedSections(new Set());
      setAllCollapsed(false);
      toast({
        title: "Sections Expanded",
        description: "All sections are now visible."
      });
    } else {
      // Collapse all
      setCollapsedSections(new Set(sections));
      setAllCollapsed(true);
      toast({
        title: "Sections Collapsed",
        description: "All sections have been minimized."
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
    
    // Update allCollapsed state
    setAllCollapsed(newCollapsed.size === sections.length);
  };

  const getSectionTitle = (id: string) => {
    const titles: Record<string, string> = {
      hair: 'Hair', patterns: 'Patterns', colours: 'Colours', tops: 'Tops',
      dresses: 'Dresses', pants: 'Pants', shoes: 'Shoes', adjustments: 'Adjustments'
    };
    return titles[id] || id;
  };
  const resetPositionAndSize = () => {
    setPosition({
      x: 50,
      y: 50
    });
    setSize({
      width: 800,
      height: 600
    });
    toast({
      title: "Window Reset",
      description: "Position and size have been reset to default."
    });
  };
  const exportConfiguration = () => {
    const config = {
      selectedColor,
      position,
      size,
      opacity,
      alwaysOnTop,
      theme
    };
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'character-config.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Configuration Exported",
      description: "Your settings have been saved to a file."
    });
  };
  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setSelectedColor(config.selectedColor);
          setPosition(config.position);
          setSize(config.size);
          setOpacity(config.opacity);
          setAlwaysOnTop(config.alwaysOnTop);
          setTheme(config.theme);
          toast({
            title: "Configuration Imported",
            description: "Your settings have been restored successfully."
          });
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to import configuration file.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // Global profile management
  const exportAllProfiles = () => {
    const categories = ['hair', 'patterns', 'colours', 'tops', 'dresses', 'pants', 'shoes', 'adjustments'];
    const allProfiles: Record<string, any[]> = {};
    let totalProfiles = 0;

    categories.forEach(category => {
      const profilesKey = `saved-profiles-${category}`;
      const profilesData = localStorage.getItem(profilesKey);
      if (profilesData) {
        try {
          const profiles = JSON.parse(profilesData);
          if (Array.isArray(profiles) && profiles.length > 0) {
            allProfiles[category] = profiles;
            totalProfiles += profiles.length;
          }
        } catch (error) {
          console.warn(`Failed to parse profiles for category ${category}:`, error);
        }
      }
    });

    if (totalProfiles === 0) {
      toast({
        title: "❌ No Profiles to Export",
        description: "No profiles found across any category",
        variant: "destructive",
      });
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalProfiles,
      categories: Object.keys(allProfiles),
      profiles: allProfiles
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-profiles-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "📥 All Profiles Exported!",
      description: `Exported ${totalProfiles} profiles across ${Object.keys(allProfiles).length} categories`,
    });
  };

  const importAllProfiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "❌ Invalid File Type",
        description: "Please select a valid JSON file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (!importData.profiles || typeof importData.profiles !== 'object') {
          throw new Error('Invalid file format');
        }

        let totalImported = 0;
        const importedCategories: string[] = [];

        Object.entries(importData.profiles).forEach(([category, profiles]) => {
          if (Array.isArray(profiles) && profiles.length > 0) {
            const profilesKey = `saved-profiles-${category}`;
            localStorage.setItem(profilesKey, JSON.stringify(profiles));
            totalImported += profiles.length;
            importedCategories.push(category);
          }
        });

        if (totalImported === 0) {
          toast({
            title: "❌ No Valid Profiles",
            description: "No valid profiles found in the file",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "📤 Profiles Imported!",
          description: `Successfully imported ${totalImported} profiles across ${importedCategories.length} categories: ${importedCategories.join(', ')}`,
        });
        
        // Reload the page to refresh all components with new data
        window.location.reload();
        
      } catch (error) {
        toast({
          title: "❌ Import Failed",
          description: "Failed to parse the profiles file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };
  useEffect(() => {
    localStorage.setItem(`customization-opacity-${pageKey}`, opacity.toString());
  }, [opacity, pageKey]);

  useEffect(() => {
    localStorage.setItem(`customization-alwaysOnTop-${pageKey}`, JSON.stringify(alwaysOnTop));
  }, [alwaysOnTop, pageKey]);

  useEffect(() => {
    localStorage.setItem(`customization-theme-${pageKey}`, theme);
  }, [theme, pageKey]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
      if (isResizing) {
        const newWidth = Math.max(600, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(400, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({
          width: newWidth,
          height: newHeight
        });
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
    return null; // Don't show any button when overlay is hidden
  }
  return <div ref={overlayRef} className={cn("fixed select-none transition-all duration-300 ease-smooth", isDragging || isResizing ? "cursor-grabbing" : "cursor-grab", theme === 'dark' ? 'dark' : '')} style={{
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    zIndex: alwaysOnTop ? 9999 : 50,
    opacity: opacity / 100
  }} onMouseDown={handleMouseDown}>
      <Card className="bg-gradient-to-br from-pink-50/95 to-purple-100/95 backdrop-blur-lg border-4 border-pink-200/60 shadow-xl w-full h-full overflow-hidden relative magic-cursor">
        {/* Header */}
        <div data-drag-handle className="flex items-center justify-between p-4 border-b-4 border-white cursor-move" style={{ backgroundColor: '#ff66b3' }}>
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-white" />
            <h2 className="text-lg font-semibold text-white">Menu</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllSections}
              className="hover:bg-white/20 text-white hover:text-white"
              title={allCollapsed ? "Expand All Sections" : "Collapse All Sections"}
            >
              {allCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
            <SettingsMenu opacity={opacity} onOpacityChange={setOpacity} alwaysOnTop={alwaysOnTop} onAlwaysOnTopChange={setAlwaysOnTop} theme={theme} onThemeChange={setTheme} onResetPosition={resetPositionAndSize} onExportConfig={exportConfiguration} onImportConfig={importConfiguration} onExportAllProfiles={exportAllProfiles} onImportAllProfiles={importAllProfiles} />
            <Button variant="ghost" size="sm" onClick={onToggle} className="hover:bg-white/20 text-white hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full">
          {/* Content Area - Full Width */}
          <div className="flex-1 min-h-0 p-4">
            <div className="h-full overflow-y-auto custom-scrollbar">
              {/* Display all sections content */}
              <div className="space-y-2">
                {sections.map(sectionId => (
                  <SectionPanel 
                    key={sectionId}
                    sectionId={sectionId} 
                    sectionTitle={getSectionTitle(sectionId)} 
                    selectedColor={selectedColor}
                    isCollapsed={collapsedSections.has(sectionId)}
                    onToggleCollapse={() => toggleSection(sectionId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Resize Handle */}
        <div className="absolute bottom-2 right-2 w-6 h-6 cursor-nw-resize bg-pink-400/30 hover:bg-pink-400/50 transition-colors rounded-full flex items-center justify-center" onMouseDown={handleResizeStart} title="Drag to resize">
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
        </div>
      </Card>
      <SparkleEffect />
      
      {/* Heart Color Picker */}
      <HeartColorPicker 
        currentColor={selectedColor} 
        onColorSelect={setSelectedColor} 
        savedColors={savedColors} 
        onSaveColor={color => {
          const newColors = [...savedColors, color];
          setSavedColors(newColors);
          localStorage.setItem(`customization-colors-${pageKey}`, JSON.stringify(newColors));
        }} 
        onDeleteColor={index => {
          const newColors = savedColors.filter((_, i) => i !== index);
          setSavedColors(newColors);
          localStorage.setItem(`customization-colors-${pageKey}`, JSON.stringify(newColors));
        }} 
      />
    </div>;
};