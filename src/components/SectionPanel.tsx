import React from 'react';
import { ImageGallery } from './ImageGallery';
import { ChevronDown, ChevronUp, Heart, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import hairMain from '@/assets/hair-main.jpg';
import hair1 from '@/assets/hair-1.jpg';
import hair2 from '@/assets/hair-2.jpg';
import hair3 from '@/assets/hair-3.jpg';
import hair4 from '@/assets/hair-4.jpg';

/* Custom Scrollbar Styles for SectionPanel - Theme Aware */
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  :root .custom-scrollbar::-webkit-scrollbar-track {
    background: hsl(var(--overlay-border) / 0.2);
    border-radius: 6px;
  }
  :root .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.6);
    border-radius: 6px;
  }
  :root .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary) / 0.8);
  }
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: hsl(var(--overlay-border) / 0.3);
    border-radius: 6px;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.7);
    border-radius: 6px;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary) / 0.9);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('section-panel-scrollbar');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'section-panel-scrollbar';
    styleSheet.type = 'text/css';
    styleSheet.innerText = scrollbarStyles;
    document.head.appendChild(styleSheet);
  }
}

interface SectionPanelProps {
  sectionId: string;
  sectionTitle: string;
  selectedColor: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
}

// Mock data for different sections - you can replace with real data
const sectionData: Record<string, { mainImage: string; thumbnails: string[] }> = {
  hair: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  colours: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  tops: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  dresses: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  pants: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  shoes: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  adjustments: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
};

export const SectionPanel: React.FC<SectionPanelProps> = ({
  sectionId,
  sectionTitle,
  selectedColor,
  isCollapsed = false,
  onToggleCollapse,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const data = sectionData[sectionId as keyof typeof sectionData];

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Section not found</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "rounded-lg overflow-visible transition-[border-color,box-shadow,transform] duration-200 ease-out transform-gpu relative bg-overlay-surface shadow-panel",
        isCollapsed 
          ? "hover:shadow-glow" 
          : "shadow-panel",
        isDragging && "rotate-2 scale-105 shadow-glow border-overlay-active z-50",
        isDragOver && "ring-2 ring-overlay-active ring-opacity-50 scale-[1.02] z-40"
      )}
      style={{
        backgroundColor: 'hsl(var(--overlay-surface))',
        boxShadow: isCollapsed 
          ? 'var(--shadow-panel)' 
          : 'var(--shadow-panel)',
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : isDragOver ? 'scale(1.02)' : 'none',
        zIndex: isDragging ? 50 : isDragOver ? 40 : 'auto',
        position: 'relative'
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
    >
      {/* Header */}
      <div className={cn(
        "p-2 flex items-center justify-between",
        isCollapsed 
          ? "py-1 bg-overlay-surface" 
          : "py-2 bg-overlay-surface"
      )} style={{
        backgroundColor: 'hsl(var(--overlay-surface))'
      }}>
        <div className="flex items-center gap-2 group">
          <div 
            title="Drag to reorder" 
            className="cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-overlay-hover select-none"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              onDragStart?.();
            }}
            onDragEnd={onDragEnd}
          >
            <GripVertical className="w-4 h-4 text-primary" />
          </div>
          <Heart 
            className="w-5 h-5 stroke-primary-foreground stroke-2" 
            style={{ fill: 'hsl(var(--primary))', color: 'hsl(var(--primary))' }}
          />
          <h3 className={cn(
            "font-bold transition-[color,transform] duration-150 ease-out",
            "group-hover:scale-105 group-hover:text-primary",
            isCollapsed ? "text-sm text-primary" : "text-lg text-primary"
          )}>{sectionTitle}</h3>
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-foreground hover:bg-overlay-hover hover:text-primary"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "transition-[max-height,opacity,transform] duration-200 ease-out overflow-hidden transform-gpu",
        isCollapsed 
          ? "max-h-0 opacity-0 scale-y-95 -translate-y-1" 
          : "max-h-[75vh] opacity-100 scale-y-100 translate-y-0"
      )}>
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          <ImageGallery
            mainImage={data.mainImage}
            thumbnails={data.thumbnails}
            selectedColor={selectedColor}
            category={sectionId}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SectionPanel);