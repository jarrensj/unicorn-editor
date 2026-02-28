
import React, { useRef } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ActionButtons, { type ActionButtonsComponentProps } from "./ActionButtons";
import OverlayItem from "./overlays/OverlayItem";
import type { Overlay } from "@/types/overlay";

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
  overlays: Overlay[];
  selectedOverlayId: string | null;
  onSelectOverlay: (id: string | null) => void;
  onUpdateOverlay: (id: string, updates: Partial<Overlay>) => void;
  onDeleteOverlay: (id: string) => void;
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
  overlays,
  selectedOverlayId,
  onSelectOverlay,
  onUpdateOverlay,
  onDeleteOverlay,
}: ImagePreviewProps) => {
  const overlayContainerRef = useRef<HTMLDivElement>(null);

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
        onClick={() => onSelectOverlay(null)}
      >
        {/* Content wrapper with aspect ratio container */}
        <div className="relative w-full h-full">
          <AspectRatio ratio={canvasWidth / canvasHeight} className="w-full h-full">
            <div
              ref={overlayContainerRef}
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
                      borderRadius: `${imageCornerRadius}px`
                    }}
                  />
                </div>
              )}

              {/* Overlay Layer */}
              {overlays.map((overlay) => (
                <OverlayItem
                  key={overlay.id}
                  overlay={overlay}
                  isSelected={selectedOverlayId === overlay.id}
                  onSelect={(id) => onSelectOverlay(id)}
                  onUpdate={onUpdateOverlay}
                  onDelete={onDeleteOverlay}
                  containerRef={overlayContainerRef}
                />
              ))}
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
        overlays={overlays}
      />
    </div>
  );
};

export default ImagePreview;
