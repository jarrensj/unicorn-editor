
import React from "react";
import { Check, X } from "lucide-react";

type SavedBackgroundImageProps = {
  id: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: (e: React.MouseEvent) => void;
};

const SavedBackgroundImage = ({
  id,
  imageUrl,
  isSelected,
  onSelect,
  onRemove
}: SavedBackgroundImageProps) => {
  return (
    <div
      className={`relative p-4 border rounded-md flex flex-col items-center transition-all ${
        isSelected ? 'border-unicorn-purple ring-2 ring-unicorn-purple/30' : 'border-gray-200 hover:border-unicorn-purple/50'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <div 
        className="w-full h-12 mb-2 rounded-md border border-gray-100 bg-center bg-cover"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <span className="text-sm truncate w-full text-center">Custom Image</span>
      
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
        onClick={onRemove}
        type="button"
      >
        <X className="h-3 w-3" />
      </button>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-unicorn-purple text-white rounded-full p-0.5">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default SavedBackgroundImage;
