
import { toast } from "sonner";
import { composeEditedImage } from "./compose";
import { canvasToBlob, downloadImage, shareImage, openImageInNewTab } from "./share";
import { isMobileDevice, isIOSSafari } from "./device";
import { DEFAULT_WATERMARK_POSITION, type WatermarkPosition } from "./watermark";

// Process an image for download
export const processImageDownload = (
  imageUrl: string | null, 
  imageElement: HTMLImageElement | null,
  selectedBackground: string,
  backgroundImage: string | null,
  imageScale: number = 100, // Default scale is 100%
  _squareFormat: boolean = true, // Parameter kept for compatibility but always used as true
  imageCornerRadius: number = 0, // Corner radius for the uploaded image
  frameCornerRadius: number = 0, // Corner radius for the entire frame
  targetSize?: { width: number; height: number },
  watermarkText: string = "",
  watermarkPosition: WatermarkPosition = DEFAULT_WATERMARK_POSITION
) => {
  if (!imageUrl || !imageElement) return;
  
  void composeAndDownload({
    imageElement,
    selectedBackground,
    backgroundImage,
    imageScale,
    imageCornerRadius,
    frameCornerRadius,
    targetSize,
    watermarkText,
    watermarkPosition,
  });
};

const composeAndDownload = async (params: {
  imageElement: HTMLImageElement;
  selectedBackground: string;
  backgroundImage: string | null;
  imageScale: number;
  imageCornerRadius: number;
  frameCornerRadius: number;
  targetSize?: { width: number; height: number };
  watermarkText: string;
  watermarkPosition: WatermarkPosition;
}) => {
  try {
    const canvas = await composeEditedImage(params);
    await finishDownload(canvas);
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Failed to download image!");
  }
};

// Handle the final steps of the download process
const finishDownload = async (canvas: HTMLCanvasElement) => {
  try {
    const blob = await canvasToBlob(canvas);
    
    if (isMobileDevice()) {
      // Try web share API first
      const shared = await shareImage(blob);
      
      if (!shared) {
        // If share API failed or is not available
        if (isIOSSafari()) {
          openImageInNewTab(blob);
        } else {
          // Standard download for other mobile browsers
          downloadImage(blob);
        }
      }
    } else {
      // Desktop browsers - standard download
      downloadImage(blob);
    }
  } catch (error) {
    console.error("Error finishing download:", error);
    toast.error("Failed to process image!");
  }
};
