import React from 'react';
import { ImageGallery } from './ImageGallery';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  patterns: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  colours: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  tops: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  dresses: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  pants: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  shoes: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
  },
  adjustments: {
    mainImage: '/src/assets/hair-main.jpg',
    thumbnails: [
      '/src/assets/hair-1.jpg',
      '/src/assets/hair-2.jpg',
      '/src/assets/hair-3.jpg',
      '/src/assets/hair-4.jpg',
    ],
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
      "border rounded-lg overflow-hidden",
      isCollapsed 
        ? "border-pink-300 bg-gradient-to-r from-white/90 to-pink-100/90" 
        : "border-white bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "p-2 border-b flex items-center justify-between",
        isCollapsed 
          ? "py-1 border-pink-200 bg-gradient-to-r from-pink-50/80 to-white/80" 
          : "py-2 border-pink-200 bg-white"
      )}>
        <div className="flex items-center gap-2">
          <Heart 
            className="w-5 h-5 stroke-white stroke-2" 
            style={{ fill: '#ff66b3', color: '#ff66b3' }}
          />
          <h3 className={cn(
            "font-bold",
            isCollapsed ? "text-sm text-pink-600" : "text-lg text-pink-600"
          )}>{sectionTitle}</h3>
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-pink-600 hover:text-pink-700"
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
        "transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "max-h-0 opacity-0" : "max-h-[75vh] opacity-100"
      )}>
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          <ImageGallery
            mainImage={data.mainImage}
            thumbnails={data.thumbnails}
            selectedColor={selectedColor}
          />
        </div>
      </div>
    </div>
  );
};