import React from "react";
import { Button } from "@/components/ui/button";

type ImageCornerRadiusProps = {
  imageCornerRadius: number;
  frameCornerRadius: number;
  onImageCornerRadiusChange: (radius: number) => void;
  onFrameCornerRadiusChange: (radius: number) => void;
};

const ImageCornerRadius = ({ 
  imageCornerRadius, 
  frameCornerRadius, 
  onImageCornerRadiusChange, 
  onFrameCornerRadiusChange 
}: ImageCornerRadiusProps) => {
  const isImageRounded = imageCornerRadius > 0;
  const isFrameRounded = frameCornerRadius > 0;

  const handleImageSquareClick = () => {
    onImageCornerRadiusChange(0);
  };

  const handleImageRoundedClick = () => {
    onImageCornerRadiusChange(12);
  };

  const handleFrameSquareClick = () => {
    onFrameCornerRadiusChange(0);
  };

  const handleFrameRoundedClick = () => {
    onFrameCornerRadiusChange(20);
  };

  return (
    <div className="space-y-4">
      {/* Image Corners */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Image Corners</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={!isImageRounded ? "default" : "outline"}
            size="sm"
            onClick={handleImageSquareClick}
            className="flex-1"
          >
            Square
          </Button>
          <Button
            variant={isImageRounded ? "default" : "outline"}
            size="sm"
            onClick={handleImageRoundedClick}
            className="flex-1"
          >
            Rounded
          </Button>
        </div>
      </div>

      {/* Frame Corners */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Frame Corners</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={!isFrameRounded ? "default" : "outline"}
            size="sm"
            onClick={handleFrameSquareClick}
            className="flex-1"
          >
            Square
          </Button>
          <Button
            variant={isFrameRounded ? "default" : "outline"}
            size="sm"
            onClick={handleFrameRoundedClick}
            className="flex-1"
          >
            Rounded
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCornerRadius; 