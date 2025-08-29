import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import hairMain from '@/assets/hair-main.jpg';
import hair1 from '@/assets/hair-1.jpg';
import hair2 from '@/assets/hair-2.jpg';
import hair3 from '@/assets/hair-3.jpg';
import hair4 from '@/assets/hair-4.jpg';

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
  selectedColor: string;
}

// Map the imported images
const imageMap: Record<string, string> = {
  '/src/assets/hair-main.jpg': hairMain,
  '/src/assets/hair-1.jpg': hair1,
  '/src/assets/hair-2.jpg': hair2,
  '/src/assets/hair-3.jpg': hair3,
  '/src/assets/hair-4.jpg': hair4,
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  thumbnails,
  selectedColor,
}) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className="h-full flex gap-4">
      {/* Main Image - Smaller size */}
      <div className="w-80 bg-overlay-surface/30 rounded-lg border border-overlay-border overflow-hidden">
        <div className="aspect-square w-full">
          <img
            src={imageMap[selectedImage] || selectedImage}
            alt="Selected item"
            className="w-full h-full object-cover"
            style={{ filter: `hue-rotate(${selectedColor ? '0deg' : '0deg'})` }}
          />
        </div>
        
        {/* Color indicator */}
        <div className="p-3 bg-overlay-surface/50 border-t border-overlay-border">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border border-overlay-border"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-xs text-muted-foreground">Selected Color</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="w-20 flex flex-col gap-2">
        {thumbnails.map((thumbnail, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "p-1 h-auto aspect-square rounded-lg border-2 transition-all duration-200",
              selectedImage === thumbnail
                ? "border-primary shadow-glow"
                : "border-overlay-border hover:border-overlay-active/50"
            )}
            onClick={() => handleThumbnailClick(thumbnail)}
          >
            <img
              src={imageMap[thumbnail] || thumbnail}
              alt={`Option ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
          </Button>
        ))}
      </div>
    </div>
  );
};