import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings, Move } from 'lucide-react';
import { SectionPanel } from './SectionPanel';
import { cn } from '@/lib/utils';

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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

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
        "fixed z-50 select-none transition-all duration-300 ease-smooth",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="bg-overlay-bg/95 backdrop-blur-lg border-overlay-border shadow-overlay min-w-80 max-h-[600px] overflow-hidden">
        {/* Header */}
        <div
          data-drag-handle
          className="flex items-center justify-between p-4 border-b border-overlay-border bg-gradient-surface cursor-move"
        >
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Character Editor</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-overlay-hover text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 bg-overlay-surface/50 border-r border-overlay-border">
            <nav className="p-2">
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
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-[400px]">
            {activeSection ? (
              <SectionPanel
                sectionId={activeSection}
                sectionTitle={sections.find(s => s.id === activeSection)?.title || ''}
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
      </Card>
    </div>
  );
};