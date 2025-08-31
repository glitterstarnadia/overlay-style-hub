import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionPanel } from './SectionPanel';
import { SettingsMenu } from './SettingsMenu';
import MenuSparkles from './MenuSparkles';
import SparkleTrail from './SparkleTrail';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Move localStorage access outside of render
const getStoredValue = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

interface MainMenuPageProps {
  pageKey?: string;
}

const MainMenuPage: React.FC<MainMenuPageProps> = ({
  pageKey = 'default'
}) => {
  const { toast } = useToast();
  
  // Memoize initial values to prevent recalculation on every render
  const initialSections = useMemo(() => 
    getStoredValue(`sections-order-${pageKey}`, ['hair', 'patterns', 'colours', 'tops', 'dresses', 'pants', 'shoes', 'adjustments']),
    [pageKey]
  );
  
  const initialTheme = useMemo(() => 
    getStoredValue(`customization-theme-${pageKey}`, 'dark'),
    [pageKey]
  );

  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [sections, setSections] = useState<string[]>(initialSections);
  
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  // Settings state
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);

  const menuRef = useRef<HTMLDivElement>(null);

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
      hair: 'Hair', patterns: 'Patterns', colours: 'Colours', tops: 'Tops',
      dresses: 'Dresses', pants: 'Pants', shoes: 'Shoes', adjustments: 'Adjustments'
    };
    return (id: string) => titles[id] || id;
  }, []);

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

  return (
    <div 
      ref={menuRef} 
      className={cn("min-h-screen w-full flex items-center justify-center p-4", theme === 'dark' ? 'dark' : '')}
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Sparkle Trail Effects */}
      <SparkleTrail containerRef={menuRef} />
      
      {/* Main Card Container */}
      <Card className="w-full max-w-4xl h-[80vh] relative magic-cursor transform-gpu overflow-hidden bg-gradient-to-br from-pink-50/95 to-purple-100/95 backdrop-blur-lg border-4 border-pink-200/60 shadow-3d">
        {/* 3D Inner Frame */}
        <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-white/20 to-transparent border border-white/30 pointer-events-none" />
        
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b-4 border-white relative gradient-cycle shadow-inner-3d" 
          style={{ 
            background: 'linear-gradient(-45deg, #ff64b4, #ff99cc, #b399ff, #ccccff, #e6b3ff, #ff64b4)',
            backgroundSize: '400% 400%',
          }}
        >
          <MenuSparkles />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-3 h-3 rounded-full bg-white/40 animate-pulse shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-white/60 animate-pulse delay-75 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse delay-150 shadow-inner" />
          </div>
          
          <h1 className="text-2xl font-bold text-white text-shadow-lg relative z-10 drop-shadow-lg">
            Character Customizer
          </h1>
          
          <div className="flex gap-2 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllSections}
              className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm bg-white/10"
              title={allCollapsed ? "Expand all sections" : "Collapse all sections"}
            >
              {allCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            
            <SettingsMenu
              opacity={100}
              onOpacityChange={() => {}}
              alwaysOnTop={false}
              onAlwaysOnTopChange={() => {}}
              theme={theme}
              onThemeChange={setTheme}
              webBarVisible={true}
              onWebBarVisibleChange={() => {}}
              onResetPosition={() => {}}
              onExportConfig={() => {}}
              onImportConfig={() => {}}
              onExportAllProfiles={exportAllProfiles}
              onImportAllProfiles={importAllProfiles}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-80px)] overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {sections.map((sectionId, index) => (
            <div key={sectionId} className="relative">
              {/* Drop preview line */}
              {dragOverSection === sectionId && draggedSection && draggedSection !== sectionId && (
                <div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full shadow-lg animate-pulse z-20" />
              )}
              
              <SectionPanel
                sectionId={sectionId}
                sectionTitle={getSectionTitle(sectionId)}
                selectedColor={selectedColor}
                isCollapsed={collapsedSections.has(sectionId)}
                onToggleCollapse={() => toggleSection(sectionId)}
                onDragStart={() => handleSectionDragStart(sectionId)}
                onDragEnd={handleSectionDragEnd}
                onDragOver={() => handleSectionDragOver(sectionId)}
                onDrop={() => handleSectionDrop(sectionId)}
                isDragging={draggedSection === sectionId}
                isDragOver={dragOverSection === sectionId}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MainMenuPage;