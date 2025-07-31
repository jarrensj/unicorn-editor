import React from "react";
import { Button } from "@/components/ui/button";

type ImageCornerRadiusProps = {
  cornerRadius: number;
  onCornerRadiusChange: (radius: number) => void;
};

const ImageCornerRadius = ({ cornerRadius, onCornerRadiusChange }: ImageCornerRadiusProps) => {
  const isRounded = cornerRadius > 0;

  const handleSharpClick = () => {
    onCornerRadiusChange(0);
  };

  const handleRoundedClick = () => {
    onCornerRadiusChange(12); // Set to 12px for rounded corners
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Corners</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant={!isRounded ? "default" : "outline"}
          size="sm"
          onClick={handleSharpClick}
          className="flex-1"
        >
          Square
        </Button>
        <Button
          variant={isRounded ? "default" : "outline"}
          size="sm"
          onClick={handleRoundedClick}
          className="flex-1"
        >
          Rounded
        </Button>
      </div>
    </div>
  );
};

export default ImageCornerRadius; 