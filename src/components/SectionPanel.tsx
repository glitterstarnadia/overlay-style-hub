import React from 'react';
import { ImageGallery } from './ImageGallery';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <div className="border border-overlay-border rounded-lg bg-overlay-surface/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-overlay-border bg-overlay-surface/30 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{sectionTitle}</h3>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-foreground"
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
        isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
      )}>
        <div className="p-4">
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