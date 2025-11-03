
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import FloatingOrbs from "./hero/FloatingOrbs";
import HeroContent from "./hero/HeroContent";
import ImageUploader from "./image-editor/ImageUploader";
import { useMousePosition } from "@/hooks/useMousePosition";
import { combineImages } from "@/utils/image/processor/canvas";
import { toast } from "sonner";

type HeroSectionProps = {
  onImageUploaded: (imageDataUrl: string, isDual?: boolean, originalImages?: { image1: string; image2: string }) => void;
};

const HeroSection = ({ onImageUploaded }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(heroRef);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    onImageUploaded(imageDataUrl, false);
  };

  const handleDualImageUpload = async (image1: string, image2: string) => {
    try {
      toast.info("Combining images...");
      const combinedImage = await combineImages(image1, image2, 0); // Initial combination with no corner radius
      setUploadedImage(combinedImage);
      onImageUploaded(combinedImage, true, { image1, image2 });
      toast.success("Images combined successfully!");
    } catch (error) {
      console.error("Error combining images:", error);
      toast.error("Failed to combine images. Please try again.");
    }
  };
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-20"
    >
      <HeroContent />
      
      {/* Always show the ImageUploader, not conditionally */}
      <ImageUploader 
        onImageUpload={handleImageUpload} 
        onDualImageUpload={handleDualImageUpload}
      />
      
      <FloatingOrbs mousePosition={mousePosition} />
    </div>
  );
};

export default HeroSection;
