import React from 'react';
import { ImageGallery } from './ImageGallery';

interface SectionPanelProps {
  sectionId: string;
  sectionTitle: string;
  selectedColor: string;
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-overlay-border bg-overlay-surface/30">
        <h3 className="text-lg font-semibold text-foreground">{sectionTitle}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <ImageGallery
          mainImage={data.mainImage}
          thumbnails={data.thumbnails}
          selectedColor={selectedColor}
        />
      </div>
    </div>
  );
};