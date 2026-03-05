
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ActionButtons, { type ActionButtonsComponentProps } from "./ActionButtons";

type ImagePreviewProps = {
  imageUrl: string | null;
  selectedBackground: string;
  backgroundImage: string | null;
  onDownload: () => void;
  imageScale: number;
  imageCornerRadius: number;
  frameCornerRadius: number;
  canvasWidth: number;
  canvasHeight: number;
  isDualMode?: boolean;
};

const ImagePreview = ({ 
  imageUrl, 
  selectedBackground, 
  backgroundImage,
  onDownload,
  imageScale,
  imageCornerRadius,
  frameCornerRadius,
  canvasWidth,
  canvasHeight,
  isDualMode = false
}: ImagePreviewProps) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-xl font-semibold mb-4">Preview</h3>
      
      {/* Preview container */}
      <div 
        className="border rounded-lg overflow-hidden flex-1 flex items-center justify-center p-4 relative"
        style={{ 
          minHeight: "300px",
          position: "relative"
        }}
      >
        {/* Content wrapper with aspect ratio container */}
        <div className="relative w-full h-full">
          <AspectRatio ratio={canvasWidth / canvasHeight} className="w-full h-full">
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{
                borderRadius: frameCornerRadius > 0 ? `${frameCornerRadius}px` : '0px',
                overflow: 'hidden'
              }}
            >
              {/* Background Layer */}
              {backgroundImage && (
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              )}
              {!backgroundImage && selectedBackground !== "transparent" && (
                <div className="absolute inset-0" style={{ 
                  background: selectedBackground,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              )}
              
              {/* Image Layer */}
              {imageUrl && (
                <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded screenshot" 
                    className="max-h-full max-w-full object-contain"
                    style={{ 
                      transform: `scale(${imageScale / 100})`,
                      transition: 'transform 0.2s ease-in-out',
                      maxWidth: '95%',
                      maxHeight: '95%',
                      // In dual mode, corner radius is already applied to individual images
                      borderRadius: isDualMode ? '0px' : `${imageCornerRadius}px`
                    }}
                  />
                </div>
              )}
            </div>
          </AspectRatio>
        </div>
      </div>
      
      {/* Action buttons */}
      <ActionButtons 
        imageUrl={imageUrl}
        onDownload={onDownload}
        selectedBackground={selectedBackground}
        backgroundImage={backgroundImage}
        imageScale={imageScale}
        imageCornerRadius={imageCornerRadius}
        frameCornerRadius={frameCornerRadius}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        isDualMode={isDualMode}
      />
    </div>
  );
};

export default ImagePreview;
