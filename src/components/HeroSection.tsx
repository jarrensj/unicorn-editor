
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import FloatingOrbs from "./hero/FloatingOrbs";
import HeroContent from "./hero/HeroContent";
import ImageUploader from "./image-editor/ImageUploader";
import { useMousePosition } from "@/hooks/useMousePosition";

type HeroSectionProps = {
  onImageUploaded: (imageDataUrl: string) => void;
};

const HeroSection = ({ onImageUploaded }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(heroRef);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    onImageUploaded(imageDataUrl);
  };
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-20"
    >
      <HeroContent />
      
      {/* Always show the ImageUploader, not conditionally */}
      <ImageUploader onImageUpload={handleImageUpload} />
      
      <FloatingOrbs mousePosition={mousePosition} />
    </div>
  );
};

export default HeroSection;
