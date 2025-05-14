
import { toast } from "sonner";
import { isMobileDevice, isIOSSafari } from "./device";

// Convert a canvas to a blob
export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create blob"))),
      "image/png"
    );
  });
};

// Share using Web Share API
export const shareImage = async (blob: Blob): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }
  
  const file = new File([blob], "unicorn-editor.png", { type: "image/png" });
  
  try {
    await navigator.share({
      files: [file],
      title: "Unicorn Editor",
      text: "Check out my unicorn screenshot!"
    });
    
    toast.success("Image shared successfully!");
    return true;
  } catch (shareError) {
    console.error("Share API failed or was cancelled", shareError);
    return false;
  }
};

// Open image in new tab (iOS Safari specific)
export const openImageInNewTab = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank"; 
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Image opened. Press and hold to save to your photos!");
};

// Download the image
export const downloadImage = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "unicorn-editor.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast.success("Image saved to your device");
};

// Copy to clipboard for desktop browsers
export const copyToClipboard = async (blob: Blob): Promise<boolean> => {
  if (!navigator.clipboard || !navigator.clipboard.write) {
    return false;
  }
  
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
    
    toast.success("Image copied to clipboard!");
    return true;
  } catch (clipboardError) {
    console.error("Clipboard API failed", clipboardError);
    return false;
  }
};

// Handle image action based on device type
export const handleImageAction = async (canvas: HTMLCanvasElement): Promise<void> => {
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
      // Desktop behavior: try clipboard first, fallback to download
      const copied = await copyToClipboard(blob);
      
      if (!copied) {
        downloadImage(blob);
        toast.success("Image downloaded instead (clipboard not supported)");
      }
    }
  } catch (error) {
    console.error("Error handling image action:", error);
    toast.error("Could not process image");
  }
};
