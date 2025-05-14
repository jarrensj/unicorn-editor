import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, Share2 } from "lucide-react";
import { handleImageAction } from "@/utils/image/processor";
import { useIsMobile } from "@/hooks/use-mobile";
import { createCanvas, drawBackgroundImage, drawMainImage, drawBackground } from "@/utils/image/processor/canvas";

type ActionButtonsProps = {
  imageUrl: string | null;
  onDownload: () => void;
  selectedBackground: string;
  backgroundImage: string | null;
  imageScale: number;
};

const ActionButtons = ({ 
  imageUrl, 
  onDownload,
  selectedBackground,
  backgroundImage,
  imageScale
}: ActionButtonsProps) => {
  const isMobile = useIsMobile();
  
  const handleCopyToClipboard = () => {
    if (!imageUrl) return;
    
    const img = new Image();
    img.onload = () => {
      const { canvas, ctx } = createCanvas(img, true);
      
      // Process the image with background
      if (backgroundImage) {
        const bgImg = new Image();
        bgImg.onload = () => {
          drawBackgroundImage(ctx, bgImg, canvas);
          drawMainImage(ctx, img, canvas, imageScale);
          handleImageAction(canvas);
        };
        bgImg.src = backgroundImage;
      } else {
        drawBackground(ctx, canvas, selectedBackground);
        drawMainImage(ctx, img, canvas, imageScale);
        handleImageAction(canvas);
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
