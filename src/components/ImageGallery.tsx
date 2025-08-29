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
    <div className="p-6 flex gap-6 h-full">
      {/* Main Image - Smaller */}
      <div className="flex-shrink-0">
        <div className="relative bg-gradient-to-br from-pink-50 via-purple-50/20 to-pink-100/30 rounded-xl p-4 shadow-lg border border-pink-200/40">
          <img
            src={imageMap[selectedImage] || selectedImage}
            alt="Main character view"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-pink-100/10 rounded-xl" />
        </div>
      </div>
      
      {/* Side Panel with Scrollable Thumbnails */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-pink-700 mb-4 flex items-center gap-2">
          <span>✨</span> Variations
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {thumbnails.map((thumbnail, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-lg border border-pink-200/50 hover:border-pink-300 transition-all duration-300 hover:shadow-md cursor-pointer group"
            >
              {/* Thumbnail Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={imageMap[thumbnail] || thumbnail}
                  alt={`Variation ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md group-hover:scale-105 transition-transform duration-300 shadow-sm"
                />
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex-1 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  {/* Position Controls */}
                  <div>
                    <p className="font-medium text-pink-700 mb-1">Position</p>
                    <div className="space-y-1">
                     <div className="flex items-center gap-2">
                         <span className="text-xs text-pink-600 w-4">X:</span>
                         <input className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="0" />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-pink-600 w-4">Y:</span>
                         <input className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="0" />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-pink-600 w-4">Z:</span>
                         <input className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="0" />
                       </div>
                    </div>
                  </div>
                  
                  {/* Rotate Controls */}
                  <div>
                    <p className="font-medium text-pink-700 mb-1">Rotate</p>
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-pink-600 w-4">X:</span>
                         <input className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="0" />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-pink-600 w-4">Y:</span>
                         <input className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="0" />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-pink-600 w-4">Z:</span>
                         <input className="w-12 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="0" />
                       </div>
                    </div>
                  </div>
                </div>
                
                 {/* Scale Control */}
                 <div>
                   <p className="font-medium text-pink-700 mb-1">Scale</p>
                   <input className="w-16 px-1 py-0.5 text-xs rounded border border-pink-200 bg-white/60 focus:border-pink-400 focus:outline-none" defaultValue="1.0" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};