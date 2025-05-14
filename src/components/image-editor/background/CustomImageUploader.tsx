
import React from "react";
import { Upload } from "lucide-react";

type CustomImageUploaderProps = {
  isSelected: boolean;
  onClick: () => void;
};

const CustomImageUploader = ({ isSelected, onClick }: CustomImageUploaderProps) => {
  return (
    <button
      className={`relative p-4 border rounded-md flex flex-col items-center transition-all border-dashed
        ${isSelected ? 'border-unicorn-purple ring-2 ring-unicorn-purple/30' : 'border-gray-200 hover:border-unicorn-purple/50'}`}
      onClick={onClick}
      type="button"
    >
      <div 
        className="w-full h-12 mb-2 rounded-md border border-gray-100 flex items-center justify-center"
      >
        <Upload className="h-6 w-6 text-gray-400" />
      </div>
      <span className="text-sm">Upload Image</span>
    </button>
  );
};

export default CustomImageUploader;
