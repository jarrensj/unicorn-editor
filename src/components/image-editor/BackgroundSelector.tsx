import { useRef, useState, useEffect } from "react";
import { useSavedBackgrounds } from "@/hooks/useSavedBackgrounds";
import { useScrollIndicator } from "@/hooks/useScrollIndicator";
import { LastSelectedBackground } from "@/hooks/useLastSelectedBackground";
import BackgroundOptionsList from "./background/BackgroundOptionsList";
import ImageScale from "./ImageScale";
import ImageCornerRadius from "./ImageCornerRadius";
import WatermarkInput from "./WatermarkInput";
import { BackgroundOption } from "./background/StandardBackgroundOption";
import type { WatermarkPosition } from "@/utils/image/processor/watermark";
import { standardBackgroundOptions } from "./background/backgroundOptions";

type BackgroundSelectorProps = {
  onSelect: (background: string, backgroundId: string) => void;
  onImageUpload: (imageUrl: string, imageId: string) => void;
  initialBackground?: string;
  lastSelectedBackground?: LastSelectedBackground | null;
  imageScale?: number;
  onScaleChange?: (scale: number) => void;
  imageUrl: string | null;
  imageCornerRadius?: number;
  frameCornerRadius?: number;
  onImageCornerRadiusChange?: (radius: number) => void;
  onFrameCornerRadiusChange?: (radius: number) => void;
  watermarkText?: string;
  onWatermarkTextChange?: (value: string) => void;
  watermarkPosition?: WatermarkPosition;
  onWatermarkPositionChange?: (position: WatermarkPosition) => void;
};

const BackgroundSelector = ({ 
  onSelect, 
  onImageUpload, 
  initialBackground,
  lastSelectedBackground,
  imageScale, 
  onScaleChange,
  imageUrl,
  imageCornerRadius,
  frameCornerRadius,
  onImageCornerRadiusChange,
  onFrameCornerRadiusChange,
  watermarkText,
  onWatermarkTextChange,
  watermarkPosition,
  onWatermarkPositionChange
}: BackgroundSelectorProps) => {
  // Initialize with last selected background ID or default to rainbow
  const [selectedId, setSelectedId] = useState(lastSelectedBackground?.id || "rainbow");
  const [customImage, setCustomImage] = useState<string | null>(
    lastSelectedBackground?.type === "custom" ? lastSelectedBackground.value : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { savedBackgrounds, addBackground, removeBackground } = useSavedBackgrounds();
  const { showScrollIndicator, scrollAreaRef } = useScrollIndicator();

  const handleSelect = (option: BackgroundOption) => {
    setSelectedId(option.id);
    setCustomImage(null);
    onSelect(option.value, option.id);
  };

  const handleCustomImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSavedImageSelect = (imageUrl: string, id: string) => {
    setSelectedId(id);
    setCustomImage(imageUrl);
    onImageUpload(imageUrl, id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          const imageUrl = e.target.result;
          
          // Save to state
          setCustomImage(imageUrl);
          
          // Add to saved backgrounds and get new ID
          const newImageId = addBackground(imageUrl);
          setSelectedId(newImageId);
          
          // Notify parent with the image ID
          onImageUpload(imageUrl, newImageId);
          
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove from saved backgrounds
    removeBackground(id);
    
    // If currently selected, switch to default option
    if (selectedId === id) {
      const defaultOption = standardBackgroundOptions[0];
      setSelectedId(defaultOption.id);
      setCustomImage(null);
      onSelect(defaultOption.value, defaultOption.id);
    }
  };
  
  return (
    <div className="space-y-6 relative">
      {/* Background options list with scroll area */}
      <BackgroundOptionsList
        backgroundOptions={standardBackgroundOptions}
        selectedId={selectedId}
        savedBackgrounds={savedBackgrounds}
        scrollAreaRef={scrollAreaRef}
        showScrollIndicator={showScrollIndicator}
        onSelectStandard={handleSelect}
        onSelectCustom={handleCustomImageSelect}
        onSelectSaved={handleSavedImageSelect}
        onRemoveSaved={handleRemoveBackground}
      />
      
      {/* Hidden file input for image uploads */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*" 
        onChange={handleImageUpload}
      />

      {/* Image controls */}
      {imageUrl && (
        <div className="space-y-4">
          {/* Image size control slider */}
          {imageScale !== undefined && onScaleChange && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Image Size</h3>
              <ImageScale imageScale={imageScale} onScaleChange={onScaleChange} />
            </div>
          )}
          
          {/* Corner toggle control */}
          {imageCornerRadius !== undefined && frameCornerRadius !== undefined && 
           onImageCornerRadiusChange && onFrameCornerRadiusChange && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Corners</h3>
              <ImageCornerRadius 
                imageCornerRadius={imageCornerRadius} 
                frameCornerRadius={frameCornerRadius}
                onImageCornerRadiusChange={onImageCornerRadiusChange} 
                onFrameCornerRadiusChange={onFrameCornerRadiusChange}
              />
            </div>
          )}

          {watermarkText !== undefined && onWatermarkTextChange &&
           watermarkPosition && onWatermarkPositionChange && (
            <WatermarkInput
              value={watermarkText}
              onChange={onWatermarkTextChange}
              position={watermarkPosition}
              onPositionChange={onWatermarkPositionChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector;
