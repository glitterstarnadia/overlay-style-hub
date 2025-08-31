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

/* Custom Scrollbar Styles for SectionPanel */
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(219, 188, 255, 0.2);
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(236, 72, 153, 0.6);
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(236, 72, 153, 0.8);
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
const sectionData = {
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
        "border-4 rounded-lg overflow-visible transition-all duration-300 transform-gpu shadow-3d relative",
        isCollapsed 
          ? "border-pink-300/60 bg-gradient-to-br from-white/95 to-pink-100/95 shadow-lg hover:shadow-xl" 
          : "border-pink-400/70 bg-gradient-to-br from-white/98 to-pink-50/98 shadow-2xl",
        isDragging && "rotate-2 scale-105 shadow-3xl border-pink-500 z-50",
        isDragOver && "ring-4 ring-pink-400 ring-opacity-50 scale-102 z-40"
      )}
      style={{
        boxShadow: isCollapsed 
          ? '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.05)'
          : '0 8px 24px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 2px rgba(0,0,0,0.05)',
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
        "p-2 border-b-4 flex items-center justify-between",
        isCollapsed 
          ? "py-1 border-pink-200 bg-gradient-to-r from-pink-50/80 to-white/80" 
          : "py-2 border-pink-200 bg-white"
      )}>
        <div className="flex items-center gap-2 group">
          <div 
            title="Drag to reorder" 
            className="cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-pink-100/50 select-none"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              onDragStart?.();
            }}
            onDragEnd={onDragEnd}
          >
            <GripVertical className="w-4 h-4 text-pink-400" />
          </div>
          <Heart 
            className="w-5 h-5 stroke-white stroke-2" 
            style={{ fill: '#ff66b3', color: '#ff66b3' }}
          />
          <h3 className={cn(
            "font-bold transition-all duration-200 group-hover:scale-110 group-hover:text-pink-500",
            isCollapsed ? "text-sm text-pink-600" : "text-lg text-pink-600"
          )}>{sectionTitle}</h3>
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-pink-600 hover:bg-pink-100 hover:text-white"
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
        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden transform-gpu",
        isCollapsed 
          ? "max-h-0 opacity-0 scale-y-95 -translate-y-2" 
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