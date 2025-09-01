import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Heart, X, ImageIcon } from 'lucide-react';

interface ImageSettings {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: string | number;
  scaleHex?: string;
  hexColor1?: string;
  hexColor2?: string;
  hexColor3?: string;
  hexColor4?: string;
  hexColor5?: string;
  hexColor6?: string;
  notes?: string;
}

interface ColoursPinkBoxProps {
  controlId: string;
  index: number;
  imageKey: string;
  settings: ImageSettings;
  transformImages: Record<string, string>;
  imageMap: Record<string, string>;
  onUpdateSettings: (imageKey: string, settings: Partial<ImageSettings>) => void;
  onClearSettings: (imageKey: string) => void;
  onRemoveControl: (controlId: string) => void;
  onUploadImage: (controlId: string) => void;
  onCopyToClipboard: (value: string, label: string) => void;
}

const ColoursPinkBox: React.FC<ColoursPinkBoxProps> = ({
  controlId,
  index,
  imageKey,
  settings,
  transformImages,
  imageMap,
  onUpdateSettings,
  onClearSettings,
  onRemoveControl,
  onUploadImage,
  onCopyToClipboard,
}) => {
  return (
    <div className="bg-pink-100 rounded-lg p-4 border-2 border-pink-200 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-pink-800 font-bold text-sm">New Profile</h4>
        <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Set {index + 1}
        </span>
      </div>
      
      <div className="flex gap-4">
        {/* Left Side - Image */}
        <div className="flex-shrink-0">
          {transformImages[controlId] ? (
            <img
              src={imageMap[transformImages[controlId]] || transformImages[controlId]}
              alt="Uploaded image"
              className="w-20 h-20 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-20 h-20 bg-pink-50 border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-pink-400" />
            </div>
          )}
        </div>
        
        {/* Right Side - Upload and Colors */}
        <div className="flex-1 space-y-3">
          {/* Upload Image Section */}
          <div 
            className="bg-pink-50 border-2 border-dashed border-pink-300 rounded-lg p-3 cursor-pointer hover:bg-pink-100 transition-colors"
            onClick={() => onUploadImage(controlId)}
          >
            <div className="text-center">
              <Upload className="w-6 h-6 text-pink-500 mx-auto mb-1" />
              <p className="text-pink-600 text-xs font-medium">Upload Image</p>
            </div>
          </div>
          
          {/* Image Colors Section */}
          <div>
            <h5 className="text-pink-800 font-bold text-xs mb-2">Image 1 Colors</h5>
            <div className="space-y-2">
              {/* Hex Color 1 */}
              <div>
                <label className="text-pink-700 text-xs font-medium block mb-1">Hex Color 1</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="#ffffff"
                    className="flex-1 px-2 py-1 text-xs rounded border border-pink-300 focus:border-pink-500 focus:outline-none bg-white"
                    value={settings.hexColor1 || '#ffffff'}
                    onChange={(e) => onUpdateSettings(imageKey, { 
                      hexColor1: e.target.value 
                    })}
                  />
                  <Heart 
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
                    style={{ 
                      fill: settings.hexColor1 || '#ffffff', 
                      stroke: '#ec4899', 
                      strokeWidth: 1.5 
                    }}
                    onClick={() => onCopyToClipboard(settings.hexColor1 || '#ffffff', "Hex Color 1")}
                  />
                </div>
              </div>
              
              {/* Hex Color 2 */}
              <div>
                <label className="text-pink-700 text-xs font-medium block mb-1">Hex Color 2</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="#ffffff"
                    className="flex-1 px-2 py-1 text-xs rounded border border-pink-300 focus:border-pink-500 focus:outline-none bg-white"
                    value={settings.hexColor2 || '#ffffff'}
                    onChange={(e) => onUpdateSettings(imageKey, { 
                      hexColor2: e.target.value 
                    })}
                  />
                  <Heart 
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
                    style={{ 
                      fill: settings.hexColor2 || '#ffffff', 
                      stroke: '#ec4899', 
                      strokeWidth: 1.5 
                    }}
                    onClick={() => onCopyToClipboard(settings.hexColor2 || '#ffffff', "Hex Color 2")}
                  />
                </div>
              </div>
              
              {/* Hex Color 3 */}
              <div>
                <label className="text-pink-700 text-xs font-medium block mb-1">Hex Color 3</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="#ffffff"
                    className="flex-1 px-2 py-1 text-xs rounded border border-pink-300 focus:border-pink-500 focus:outline-none bg-white"
                    value={settings.hexColor3 || '#ffffff'}
                    onChange={(e) => onUpdateSettings(imageKey, { 
                      hexColor3: e.target.value 
                    })}
                  />
                  <Heart 
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
                    style={{ 
                      fill: settings.hexColor3 || '#ffffff', 
                      stroke: '#ec4899', 
                      strokeWidth: 1.5 
                    }}
                    onClick={() => onCopyToClipboard(settings.hexColor3 || '#ffffff', "Hex Color 3")}
                  />
                </div>
              </div>
              
              {/* Hex Color 4 */}
              <div>
                <label className="text-pink-700 text-xs font-medium block mb-1">Hex Color 4</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="#ffffff"
                    className="flex-1 px-2 py-1 text-xs rounded border border-pink-300 focus:border-pink-500 focus:outline-none bg-white"
                    value={settings.hexColor4 || '#ffffff'}
                    onChange={(e) => onUpdateSettings(imageKey, { 
                      hexColor4: e.target.value 
                    })}
                  />
                  <Heart 
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
                    style={{ 
                      fill: settings.hexColor4 || '#ffffff', 
                      stroke: '#ec4899', 
                      strokeWidth: 1.5 
                    }}
                    onClick={() => onCopyToClipboard(settings.hexColor4 || '#ffffff', "Hex Color 4")}
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Button */}
            <Button
              onClick={() => onClearSettings(imageKey)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-sm mt-3"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      
      {/* Remove Button */}
      <div className="flex justify-end mt-2">
        <Button
          onClick={() => onRemoveControl(controlId)}
          className="text-pink-600 hover:text-pink-800 text-xs underline bg-transparent hover:bg-transparent p-0 h-auto font-normal"
          title="Remove this set"
        >
          <X className="w-3 h-3 mr-1" />
          Remove Set
        </Button>
      </div>
    </div>
  );
};

export default ColoursPinkBox;