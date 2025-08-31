import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings, Move, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionPanel } from './SectionPanel';
import { SettingsMenu } from './SettingsMenu';
import MenuSparkles from './MenuSparkles';
import SparkleTrail from './SparkleTrail';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Type declarations for Electron APIs
declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      updateDiscordActivity: (details: string, state: string) => Promise<void>;
      updateDiscordState: (state: string) => Promise<void>;
      setWebBarVisibility: (visible: boolean) => Promise<void>;
      resizeWindow: (width: number, height: number) => Promise<void>;
      getWindowSize: () => Promise<[number, number]>;
    };
  }
}

// Move localStorage access outside of render
const getStoredValue = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};
interface CustomizationOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
  pageKey?: string;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}
const CustomizationOverlay: React.FC<CustomizationOverlayProps> = ({
  isVisible,
  onToggle,
  pageKey = 'default',
  onSizeChange,
  onPositionChange
}) => {
  const { toast } = useToast();
  
  // Memoize initial values to prevent recalculation on every render
  const initialSections = useMemo(() => 
    getStoredValue(`sections-order-${pageKey}`, ['hair', 'colours', 'tops', 'dresses', 'pants', 'shoes', 'adjustments']),
    [pageKey]
  );
  
  const initialOpacity = useMemo(() => 
    getStoredValue(`customization-opacity-${pageKey}`, 100),
    [pageKey]
  );
  
  const initialAlwaysOnTop = useMemo(() => 
    getStoredValue(`customization-alwaysOnTop-${pageKey}`, false),
    [pageKey]
  );
  
  const initialTheme = useMemo(() => 
    getStoredValue(`customization-theme-${pageKey}`, 'dark'),
    [pageKey]
  );
  
  const initialWebBarVisible = useMemo(() => 
    getStoredValue(`customization-webBar-${pageKey}`, true),
    [pageKey]
  );

  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [sections, setSections] = useState<string[]>(initialSections);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  // Settings state - using memoized initial values
  const [opacity, setOpacity] = useState(initialOpacity);
  const [alwaysOnTop, setAlwaysOnTop] = useState(initialAlwaysOnTop);
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);
  const [webBarVisible, setWebBarVisible] = useState(initialWebBarVisible);

  // Memoize event handlers to prevent recreation on every render
  const handleWebBarVisibilityChange = useCallback((visible: boolean) => {
    setWebBarVisible(visible);
    // Call Electron API if available
    if (typeof window !== 'undefined' && (window as any).electronAPI?.setWebBarVisibility) {
      (window as any).electronAPI.setWebBarVisibility(visible);
    }
  }, []);

  // Toggle menu collapse and resize window
  const handleToggleCollapse = useCallback(async () => {
    const newCollapsed = !isMenuCollapsed;
    setIsMenuCollapsed(newCollapsed);
    
    // Resize window based on collapse state
    if (newCollapsed) {
      // Collapsed: resize to just hotbar height (approximately 80px)
      const hotbarHeight = 80;
      const newSize = { width: size.width, height: hotbarHeight };
      setSize(newSize);
      onSizeChange?.(newSize);
      
      // If running in Electron, resize the actual window
      if (window.electronAPI?.resizeWindow) {
        try {
          await window.electronAPI.resizeWindow(size.width, hotbarHeight);
        } catch (error) {
          console.log('Failed to resize window:', error);
        }
      }
    } else {
      // Expanded: restore to full menu height (approximately 900px)
      const expandedHeight = 900;
      const newSize = { width: size.width, height: expandedHeight };
      setSize(newSize);
      onSizeChange?.(newSize);
      
      // If running in Electron, resize the actual window
      if (window.electronAPI?.resizeWindow) {
        try {
          await window.electronAPI.resizeWindow(size.width, expandedHeight);
        } catch (error) {
          console.log('Failed to resize window:', error);
        }
      }
    }
  }, [isMenuCollapsed, size.width, onSizeChange]);

  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Handle dragging the hotbar
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging when clicking on the header/hotbar
    if ((e.target as HTMLElement).closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position.x, position.y]);
  
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  }, [size.width, size.height]);

  const toggleAllSections = useCallback(() => {
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
  }, [allCollapsed, sections, toast]);

  const toggleSection = useCallback((sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
    
    // Update allCollapsed state
    setAllCollapsed(newCollapsed.size === sections.length);
  }, [collapsedSections, sections.length]);

  // Memoize section titles
  const getSectionTitle = useMemo(() => {
    const titles: Record<string, string> = {
      hair: 'Hair', colours: 'Colours & Patterns', tops: 'Tops',
      dresses: 'Dresses', pants: 'Pants', shoes: 'Shoes', adjustments: 'Adjustments'
    };
    return (id: string) => titles[id] || id;
  }, []);
  const resetPositionAndSize = useCallback(async () => {
    const newPosition = { x: 0, y: 0 };
    const newSize = isMenuCollapsed 
      ? { width: 800, height: 80 }
      : { width: 800, height: 900 };
    setPosition(newPosition);
    setSize(newSize);
    onPositionChange?.(newPosition);
    onSizeChange?.(newSize);
    
    // If running in Electron, resize the actual window
    if (window.electronAPI?.resizeWindow) {
      try {
        await window.electronAPI.resizeWindow(newSize.width, newSize.height);
      } catch (error) {
        console.log('Failed to resize window:', error);
      }
    }
    
    toast({
      title: "Window Reset",
      description: "Position and size have been reset."
    });
  }, [onPositionChange, onSizeChange, toast, isMenuCollapsed]);
  const exportConfiguration = useCallback(() => {
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
  }, [selectedColor, position, size, opacity, alwaysOnTop, theme, toast]);

  const importConfiguration = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
    // Clear the input value to allow re-importing the same file
    event.target.value = '';
  }, [toast]);

  // Global profile management
  const exportAllProfiles = () => {
    const categories = ['hair', 'colours', 'tops', 'dresses', 'pants', 'shoes', 'adjustments'];
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

  const handleSectionDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleSectionDragEnd = () => {
    setDraggedSection(null);
    setDragOverSection(null);
  };

  const handleSectionDragOver = (sectionId: string) => {
    if (draggedSection && draggedSection !== sectionId) {
      setDragOverSection(sectionId);
    }
  };

  const handleSectionDrop = (targetSectionId: string) => {
    if (draggedSection && draggedSection !== targetSectionId) {
      const newSections = [...sections];
      const draggedIndex = newSections.indexOf(draggedSection);
      const targetIndex = newSections.indexOf(targetSectionId);
      
      // Remove dragged section and insert at new position
      newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      
      setSections(newSections);
      localStorage.setItem(`sections-order-${pageKey}`, JSON.stringify(newSections));
      
      toast({
        title: "Section Reordered",
        description: `Moved ${getSectionTitle(draggedSection)} to new position`
      });
    }
    
    setDraggedSection(null);
    setDragOverSection(null);
  };

  // Add window resize listener to keep menu responsive
  useEffect(() => {
    const handleResize = () => {
      if (!isMenuCollapsed) {
        const newSize = { width: window.innerWidth, height: window.innerHeight };
        setSize(newSize);
        onSizeChange?.(newSize);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onSizeChange, isMenuCollapsed]);
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
    localStorage.setItem(`customization-webBar-${pageKey}`, JSON.stringify(webBarVisible));
  }, [webBarVisible, pageKey]);

  useEffect(() => {
    let animationId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        animationId = requestAnimationFrame(() => {
          if (isDragging) {
            const newPosition = {
              x: e.clientX - dragStart.x,
              y: e.clientY - dragStart.y
            };
            setPosition(newPosition);
            onPositionChange?.(newPosition);
          }
          if (isResizing) {
            const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
            const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
            const newSize = {
              width: newWidth,
              height: newHeight
            };
            setSize(newSize);
            onSizeChange?.(newSize);
          }
        });
      }
    };
    
    const handleMouseUp = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);
  if (!isVisible) {
    return null; // Don't show any button when overlay is hidden
  }
  return (
    <div 
      ref={overlayRef} 
      className={cn("fixed select-none", theme === 'dark' ? 'dark' : '')} 
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: alwaysOnTop ? 9999 : 50,
        opacity: opacity / 100
      }} 
      onMouseDown={handleMouseDown}
    >
      {/* Sparkle Trail Effects */}
      <SparkleTrail />
      {/* Main Card Container */}
      <Card className={cn("w-full relative magic-cursor transform-gpu overflow-hidden transition-all duration-300", isDragging || isResizing ? "bg-gradient-to-br from-pink-50/90 to-purple-100/90 border-4 border-pink-200/40 shadow-2xl" : "bg-gradient-to-br from-pink-50/95 to-purple-100/95 backdrop-blur-lg border-4 border-pink-200/60 shadow-3d")} style={{ height: isMenuCollapsed ? 'auto' : '100%' }}>
        
        {/* Header - Draggable hotbar */}
        <div 
          data-drag-handle
          className="flex items-center justify-between p-4 border-b-4 border-white relative gradient-cycle shadow-inner-3d cursor-move"
          style={{ 
            background: 'linear-gradient(-45deg, #ff64b4, #ff99cc, #b399ff, #ccccff, #e6b3ff, #ff64b4)',
            backgroundSize: '400% 400%',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)',
            // @ts-ignore - Electron specific property
            WebkitAppRegion: 'drag'
          } as any}
        >
          <MenuSparkles />
          <div className="flex items-center gap-2 relative z-10" style={{ 
            // @ts-ignore - Electron specific property
            WebkitAppRegion: 'no-drag' 
          } as any}>
            <Settings className="w-4 h-4 text-white drop-shadow-md" />
            <h2 className="text-lg font-semibold text-white drop-shadow-md">Nadia&apos;s Menu</h2>
          </div>
          <div className="flex items-center gap-2 relative z-10" style={{ 
            // @ts-ignore - Electron specific property
            WebkitAppRegion: 'no-drag' 
          } as any}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllSections}
              className="hover:bg-white/20 text-white hover:text-white drop-shadow-md transform hover:scale-105 transition-all duration-200 shadow-3d-button"
              title={allCollapsed ? "Expand All Sections" : "Collapse All Sections"}
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)'
              }}
            >
              {allCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
            <SettingsMenu 
              opacity={opacity} 
              onOpacityChange={setOpacity} 
              alwaysOnTop={alwaysOnTop} 
              onAlwaysOnTopChange={setAlwaysOnTop} 
              theme={theme} 
              onThemeChange={setTheme} 
              webBarVisible={webBarVisible}
              onWebBarVisibleChange={handleWebBarVisibilityChange}
              onResetPosition={resetPositionAndSize} 
              onExportConfig={exportConfiguration} 
              onImportConfig={importConfiguration} 
              onExportAllProfiles={exportAllProfiles} 
              onImportAllProfiles={importAllProfiles} 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleToggleCollapse} 
              className="hover:bg-white/20 text-white hover:text-white drop-shadow-md transform hover:scale-105 transition-all duration-200 shadow-3d-button"
              title={isMenuCollapsed ? "Expand Menu" : "Collapse Menu"}
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)'
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Content - Hidden when collapsed */}
        {!isMenuCollapsed && (
        <div className="flex h-full relative">
          
          {/* Scroll bar on the left */}
          <div className="w-4 bg-gradient-to-b from-pink-200/50 to-purple-200/50 border-r-2 border-white/30 relative">
            <div className="absolute inset-1 bg-gradient-to-b from-pink-300/60 to-purple-300/60 rounded-full"></div>
          </div>
          
          {/* Content Area - Full Width */}
          <div 
            className="flex-1 min-h-0 relative z-10 cursor-pointer overflow-y-auto custom-scrollbar-3d" 
            data-sparkle-zone 
            style={{ 
              height: '100%',
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              // Ensure clicks are handled in content area
              e.stopPropagation();
            }}
            onMouseEnter={(e) => {
              // Ensure hover events work
              e.currentTarget.style.pointerEvents = 'auto';
            }}
          >
            {/* Content container */}
            <div className="p-4" style={{ pointerEvents: 'auto' }}>
              {/* Display all sections content */}
              <div className="space-y-3 relative">
                {sections.map((sectionId, index) => (
                  <div 
                    key={sectionId}
                    className={cn(
                      "transform hover:scale-[1.02] transition-all duration-300 relative",
                      draggedSection === sectionId && "z-50 scale-105",
                      dragOverSection === sectionId && "z-40 scale-102"
                    )}
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                      zIndex: draggedSection === sectionId ? 50 : dragOverSection === sectionId ? 40 : index + 10
                    }}
                  >
                    <SectionPanel 
                      sectionId={sectionId} 
                      sectionTitle={getSectionTitle(sectionId)} 
                      selectedColor={selectedColor}
                      isCollapsed={collapsedSections.has(sectionId)}
                      onToggleCollapse={() => toggleSection(sectionId)}
                      isDragging={draggedSection === sectionId}
                      isDragOver={dragOverSection === sectionId}
                      onDragStart={() => handleSectionDragStart(sectionId)}
                      onDragEnd={handleSectionDragEnd}
                      onDragOver={() => handleSectionDragOver(sectionId)}
                      onDrop={() => handleSectionDrop(sectionId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
        
      </Card>
      
      {/* Resize Handle - Positioned at bottom right corner */}
      <div 
        data-resize-handle
        className={cn(
          "absolute bottom-1 right-1 w-6 h-6 cursor-nw-resize rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 z-50",
          isResizing 
            ? "bg-pink-400/80 shadow-inner" 
            : "bg-gradient-to-br from-pink-400/60 to-pink-500/70 hover:from-pink-400/80 hover:to-pink-500/90 shadow-3d-resize"
        )} 
        onMouseDown={handleResizeStart} 
        title="Drag to resize"
        style={{
          boxShadow: isResizing 
            ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
            : '0 4px 8px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4), 0 0 12px rgba(255,100,180,0.4)',
          transform: isResizing ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        <div className="w-2 h-2 bg-pink-700 rounded-full shadow-sm" 
             style={{
               boxShadow: '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.5)'
             }} />
      </div>
      
    </div>
  );
};

export default React.memo(CustomizationOverlay);