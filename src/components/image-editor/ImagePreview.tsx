
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ActionButtons from "./ActionButtons";

type ImagePreviewProps = {
  imageUrl: string | null;
  selectedBackground: string;
  backgroundImage: string | null;
  onDownload: () => void;
  imageScale: number;
};

const ImagePreview = ({ 
  imageUrl, 
  selectedBackground, 
  backgroundImage,
  onDownload,
  imageScale
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
        {/* Content wrapper with aspect ratio container for square format */}
        <div className="relative w-full h-full">
          <AspectRatio ratio={1/1} className="w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center">
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
                      maxHeight: '95%'
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
      />
    </div>
  );
};

export default ImagePreview;
