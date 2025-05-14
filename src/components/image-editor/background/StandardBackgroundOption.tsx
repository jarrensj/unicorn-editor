
import React from "react";
import { Check } from "lucide-react";

export type BackgroundOption = {
  id: string;
  name: string;
  value: string;
};

type StandardBackgroundOptionProps = {
  option: BackgroundOption;
  isSelected: boolean;
  onSelect: (option: BackgroundOption) => void;
};

const StandardBackgroundOption = ({ 
  option, 
  isSelected, 
  onSelect 
}: StandardBackgroundOptionProps) => {
  return (
    <button
      className={`relative p-4 border rounded-md flex flex-col items-center transition-all ${
        isSelected ? 'border-unicorn-purple ring-2 ring-unicorn-purple/30' : 'border-gray-200 hover:border-unicorn-purple/50'
      }`}
      onClick={() => onSelect(option)}
      type="button"
    >
      <div 
        className="w-full h-12 mb-2 rounded-md border border-gray-100"
        style={{ 
          background: option.value,
          backgroundImage: option.value.startsWith('linear-gradient') ? option.value : 'none',
          backgroundSize: "100% 100%",
        }}
      />
      <span className="text-sm">{option.name}</span>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-unicorn-purple text-white rounded-full p-0.5">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
};

export default StandardBackgroundOption;
