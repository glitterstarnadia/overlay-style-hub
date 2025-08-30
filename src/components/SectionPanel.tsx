import React from 'react';
import { ImageGallery } from './ImageGallery';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
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
}

// Mock data for different sections - you can replace with real data
const sectionData = {
  hair: {
    mainImage: hairMain,
    thumbnails: [hair1, hair2, hair3, hair4],
  },
  patterns: {
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
    <div className={cn(
      "border-4 rounded-lg overflow-hidden",
      isCollapsed 
        ? "border-pink-300 bg-gradient-to-r from-white/90 to-pink-100/90" 
        : "border-white bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "p-3 border-b-4 flex items-center justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer group relative overflow-visible",
        isCollapsed 
          ? "py-2 border-pink-200 bg-gradient-to-r from-pink-50/80 to-white/80 hover:from-pink-100/90 hover:to-pink-50/90" 
          : "py-3 border-pink-200 bg-white hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-white/50"
      )}>
        <div className="flex items-center gap-2 relative">
          <Heart 
            className="w-5 h-5 stroke-white stroke-2 transition-all duration-200 group-hover:scale-125 group-hover:drop-shadow-md relative z-50" 
            style={{ fill: '#ff66b3', color: '#ff66b3' }}
          />
          <h3 className={cn(
            "font-bold transition-all duration-200 group-hover:scale-110 group-hover:text-pink-700 group-hover:drop-shadow-sm relative z-50",
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