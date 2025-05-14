
import { toast } from "sonner";
import { createCanvas, drawBackground, drawBackgroundImage, drawMainImage } from "./canvas";
import { canvasToBlob, downloadImage, shareImage, openImageInNewTab, copyToClipboard } from "./share";
import { isMobileDevice, isIOSSafari } from "./device";

// Process an image for download
export const processImageDownload = (
  imageUrl: string | null, 
  imageElement: HTMLImageElement | null,
  selectedBackground: string,
  backgroundImage: string | null,
  imageScale: number = 100, // Default scale is 100%
  squareFormat: boolean = true // Parameter kept for compatibility but always used as true
) => {
  if (!imageUrl || !imageElement) return;
  
  try {
    const { canvas, ctx } = createCanvas(imageElement, squareFormat);
    
    // Create and process the image with background
    const processWithBackground = () => {
      // Draw background
      if (backgroundImage) {
        // If we have a custom image background
        const bgImg = new Image();
        bgImg.onload = () => {
          drawBackgroundImage(ctx, bgImg, canvas);
          drawMainImage(ctx, imageElement, canvas, imageScale);
          finishDownload(canvas);
        };
        
        bgImg.src = backgroundImage;
      } else {
        // Fill background color or use gradient
        drawBackground(ctx, canvas, selectedBackground);
        drawMainImage(ctx, imageElement, canvas, imageScale);
        finishDownload(canvas);
      }
    };

    // Start processing
    processWithBackground();
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

