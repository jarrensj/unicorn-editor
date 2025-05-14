import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Replace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ImageUploaderProps = {
  onImageUpload: (imageDataUrl: string) => void;
};

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  
  // Reset main image state on mount, but keep background images
  useEffect(() => {
    // Clear only the main image state
    setHasUploadedImage(false);
    sessionStorage.removeItem('imageUploaded');
    sessionStorage.removeItem('image');
    
    // Note: We don't clear localStorage here as it contains saved background images
  }, []);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  const handlePaste = (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        if (e.clipboardData.items[i].type.indexOf("image") !== -1) {
          const file = e.clipboardData.items[i].getAsFile();
          if (file) {
            processFile(file);
            return;
          }
        }
      }
    }
    
    toast.error("No image found in clipboard!");
  };
  
  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file!");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        try {
          // Store main image in sessionStorage (cleared on page load)
          sessionStorage.setItem('imageUploaded', 'true');
          sessionStorage.setItem('image', e.target.result);
          setHasUploadedImage(true);
          
          // Pass the image data to the parent component
          onImageUpload(e.target.result);
        } catch (error) {
          console.error('Error processing image:', error);
          toast.error("Image too large to process. Try a smaller image.");
        }
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Add paste event listener with useEffect
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
  
  return (
    <motion.div 
      className="mt-8 w-full max-w-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors flex flex-col items-center justify-center cursor-pointer ${
          isDragging ? 'border-unicorn-purple bg-unicorn-purple/10' : 'border-gray-300 hover:border-unicorn-purple/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleFileInput}
        />
        
        <div className="text-center">
          <div className="flex flex-col items-center mb-4">
            {isDragging ? (
              <Upload className="h-16 w-16 text-unicorn-purple mb-3 animate-bounce" />
            ) : hasUploadedImage ? (
              <Replace className="h-16 w-16 text-unicorn-purple mb-3" />
            ) : (
              <ImageIcon className="h-16 w-16 text-gray-400 mb-3" />
            )}
            
            <h3 className="text-xl font-medium mb-2">
              {isDragging 
                ? "Drop it like it's hot!" 
                : hasUploadedImage 
                  ? "Replace your screenshot" 
                  : "Upload your screenshot"}
            </h3>
            
            <p className="text-gray-500 mb-4">
              {hasUploadedImage 
                ? "Drag and drop a new image to replace the current one"
                : "Drag and drop, paste from clipboard, or click to browse"}
            </p>
            
            <Button
              className="unicorn-button sparkle-cursor px-6 py-2"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {hasUploadedImage ? "Replace Image" : "Select Image"}
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            Supports: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageUploader;
