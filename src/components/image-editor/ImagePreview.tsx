
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ActionButtons from "./ActionButtons";
import {
  WATERMARK_FONT_FAMILY,
  WATERMARK_LAYOUT,
} from "@/utils/image/processor/watermark";

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
  watermarkText: string;
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
  watermarkText
}: ImagePreviewProps) => {
  const trimmedWatermark = watermarkText.trim();

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
                overflow: 'hidden',
                containerType: 'size'
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
                      borderRadius: `${imageCornerRadius}px`
                    }}
                  />
                </div>
              )}

              {trimmedWatermark && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none flex justify-center"
                  aria-hidden="true"
                >
                  <p
                    className="absolute text-center break-words"
                    style={{
                      fontFamily: `"${WATERMARK_FONT_FAMILY}", sans-serif`,
                      fontWeight: WATERMARK_LAYOUT.fontWeight,
                      fontSize: `${WATERMARK_LAYOUT.fontSizeRatio * 100}cqmin`,
                      lineHeight: WATERMARK_LAYOUT.lineHeight,
                      color: WATERMARK_LAYOUT.fillStyle,
                      textShadow: `0 0.08em ${WATERMARK_LAYOUT.shadowBlurRatio}em ${WATERMARK_LAYOUT.shadowColor}`,
                      bottom: `${WATERMARK_LAYOUT.bottomPaddingRatio * 100}cqmin`,
                      maxWidth: `${WATERMARK_LAYOUT.maxWidthRatio * 100}%`,
                      margin: 0,
                    }}
                  >
                    {trimmedWatermark}
                  </p>
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
        watermarkText={watermarkText}
      />
    </div>
  );
};

export default ImagePreview;
