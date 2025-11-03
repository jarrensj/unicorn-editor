import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, Share2 } from "lucide-react";
import { handleImageAction } from "@/utils/image/processor";
import { useIsMobile } from "@/hooks/use-mobile";
import { createCanvas, drawBackgroundImage, drawMainImage, drawBackground } from "@/utils/image/processor/canvas";

export type ActionButtonsComponentProps = {
  imageUrl: string | null;
  onDownload: () => void;
  selectedBackground: string;
  backgroundImage: string | null;
  imageScale: number;
  imageCornerRadius: number;
  frameCornerRadius: number;
  canvasWidth: number;
  canvasHeight: number;
};

const ActionButtons: React.FC<ActionButtonsComponentProps> = ({ 
  imageUrl, 
  onDownload,
  selectedBackground,
  backgroundImage,
  imageScale,
  imageCornerRadius,
  frameCornerRadius,
  canvasWidth,
  canvasHeight
}: ActionButtonsComponentProps) => {
  const isMobile = useIsMobile();
  
  const handleCopyToClipboard = () => {
    if (!imageUrl) return;
    
    const img = new Image();
    img.onload = () => {
      const { canvas, ctx } = createCanvas(img, true, { width: canvasWidth, height: canvasHeight });
      
      // Process the image with background
      if (backgroundImage) {
        const bgImg = new Image();
        bgImg.onload = () => {
          drawBackgroundImage(ctx, bgImg, canvas);
          drawMainImage(ctx, img, canvas, imageScale, imageCornerRadius);
          
          // Apply frame corner radius if specified
          if (frameCornerRadius > 0) {
            const roundedCanvas = document.createElement("canvas");
            const roundedCtx = roundedCanvas.getContext("2d");
            
            if (roundedCtx) {
              roundedCanvas.width = canvas.width;
              roundedCanvas.height = canvas.height;
              
              // Create clipping path with rounded corners
              roundedCtx.beginPath();
              roundedCtx.roundRect(0, 0, canvas.width, canvas.height, frameCornerRadius);
              roundedCtx.clip();
              
              // Draw the original canvas onto the rounded canvas
              roundedCtx.drawImage(canvas, 0, 0);
              
              handleImageAction(roundedCanvas);
            } else {
              handleImageAction(canvas);
            }
          } else {
            handleImageAction(canvas);
          }
        };
        bgImg.src = backgroundImage;
      } else {
        drawBackground(ctx, canvas, selectedBackground);
        drawMainImage(ctx, img, canvas, imageScale, imageCornerRadius);
        
        // Apply frame corner radius if specified
        if (frameCornerRadius > 0) {
          const roundedCanvas = document.createElement("canvas");
          const roundedCtx = roundedCanvas.getContext("2d");
          
          if (roundedCtx) {
            roundedCanvas.width = canvas.width;
            roundedCanvas.height = canvas.height;
            
            // Create clipping path with rounded corners
            roundedCtx.beginPath();
            roundedCtx.roundRect(0, 0, canvas.width, canvas.height, frameCornerRadius);
            roundedCtx.clip();
            
            // Draw the original canvas onto the rounded canvas
            roundedCtx.drawImage(canvas, 0, 0);
            
            handleImageAction(roundedCanvas);
          } else {
            handleImageAction(canvas);
          }
        } else {
          handleImageAction(canvas);
        }
      }
    };
    img.src = imageUrl;
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      <Button 
        onClick={onDownload}
        className="unicorn-button sparkle-cursor py-2 flex-1"
        disabled={!imageUrl}
      >
        <Download className="h-4 w-4 mr-2" />
        {isMobile ? "Save to Device" : "Download Image"}
      </Button>
      
      <Button 
        onClick={handleCopyToClipboard}
        variant="outline"
        className="py-2 flex items-center justify-center gap-2"
        disabled={!imageUrl}
      >
        {isMobile ? (
          <>
            <Share2 className="h-4 w-4" />
            Share Image
          </>
        ) : (
          <>
            <Clipboard className="h-4 w-4" />
            Copy to Clipboard
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
