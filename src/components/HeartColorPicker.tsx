import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface HeartColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  savedColors: string[];
  onSaveColor: (color: string) => void;
  onDeleteColor: (index: number) => void;
}
export const HeartColorPicker: React.FC<HeartColorPickerProps> = ({
  currentColor,
  onColorSelect,
  savedColors,
  onSaveColor,
  onDeleteColor
}) => {
  const {
    toast
  } = useToast();
  const handleColorChange = (color: string) => {
    onColorSelect(color);
  };
  const saveCurrentColor = () => {
    if (!savedColors.includes(currentColor)) {
      onSaveColor(currentColor);
      toast({
        title: "💖 Color Saved!",
        description: `${currentColor} added to your palette`
      });
    }
  };
  const deleteColor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteColor(index);
    toast({
      title: "🗑️ Color Removed",
      description: "Color deleted from your palette"
    });
  };
  const HeartIcon = ({
    color,
    onClick,
    isAddButton = false,
    onDelete,
    index
  }: {
    color?: string;
    onClick: () => void;
    isAddButton?: boolean;
    onDelete?: (index: number, e: React.MouseEvent) => void;
    index?: number;
  }) => <div className="relative group">
      <button onClick={onClick} className="relative transition-transform hover:scale-110 duration-200">
        <Heart className={`w-8 h-8 transition-all duration-200 ${isAddButton ? 'text-pink-300 hover:text-pink-400 fill-pink-100 hover:fill-pink-200' : 'text-white hover:text-pink-100'}`} style={!isAddButton ? {
        fill: color,
        stroke: '#ffffff',
        strokeWidth: 2
      } : {}} />
        {isAddButton && <Plus className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500" />}
      </button>
      {!isAddButton && onDelete && typeof index === 'number' && <button onClick={e => onDelete(index, e)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600">
          <X className="w-2.5 h-2.5" />
        </button>}
    </div>;
  return <div className="space-y-3">
      {/* Saved Colors */}
      
      
      
    </div>;
};