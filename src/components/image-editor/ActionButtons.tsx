import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, Share2 } from "lucide-react";
import { composeEditedImage, handleImageAction } from "@/utils/image/processor";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

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
  watermarkText: string;
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
  canvasHeight,
  watermarkText
}: ActionButtonsComponentProps) => {
  const isMobile = useIsMobile();
  
  const handleCopyToClipboard = async () => {
    if (!imageUrl) return;
    
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = imageUrl;
      });

      const canvas = await composeEditedImage({
        imageElement: img,
        selectedBackground,
        backgroundImage,
        imageScale,
        imageCornerRadius,
        frameCornerRadius,
        targetSize: { width: canvasWidth, height: canvasHeight },
        watermarkText,
      });

      await handleImageAction(canvas);
    } catch (error) {
      console.error("Error copying image:", error);
      toast.error("Failed to copy image!");
    }
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
