
import React from "react";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";

type ImageScaleProps = {
  imageScale: number;
  onScaleChange: (scale: number) => void;
};

const ImageScale = ({ imageScale, onScaleChange }: ImageScaleProps) => {
  const handleScaleChange = (value: number[]) => {
    onScaleChange(value[0]);
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Image Size: {imageScale}%</span>
      </div>
      <div className="flex items-center gap-2">
        <ZoomOut className="h-4 w-4 text-gray-500" />
        <Slider 
          defaultValue={[100]} 
          min={50} 
          max={150} 
          step={1} 
          value={[imageScale]}
          onValueChange={handleScaleChange}
          className="flex-1"
        />
        <ZoomIn className="h-4 w-4 text-gray-500" />
      </div>
    </div>
  );
};

export default ImageScale;
