import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Replace, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ImageUploaderProps = {
  onImageUpload: (imageDataUrl: string) => void;
  onDualImageUpload?: (image1: string, image2: string) => void;
};

const ImageUploader = ({ onImageUpload, onDualImageUpload }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingSecond, setIsDraggingSecond] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondFileInputRef = useRef<HTMLInputElement>(null);
  const [firstImage, setFirstImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isDualMode, setIsDualMode] = useState(false);
  
  // Reset main image state on mount, but keep background images
  useEffect(() => {
    // Clear only the main image state
    setHasUploadedImage(false);
    setFirstImage(null);
    setSecondImage(null);
    setIsDualMode(false);
    sessionStorage.removeItem('imageUploaded');
    sessionStorage.removeItem('image');
    sessionStorage.removeItem('firstImage');
    sessionStorage.removeItem('secondImage');
    
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
      processFile(e.dataTransfer.files[0], 'first');
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], 'first');
    }
  };

  // Second image handlers
  const handleSecondDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingSecond(true);
  };
  
  const handleSecondDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingSecond(false);
  };
  
  const handleSecondDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingSecond(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], 'second');
    }
  };
  
  const handleSecondFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], 'second');
    }
  };
  
  const handlePaste = (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        if (e.clipboardData.items[i].type.indexOf("image") !== -1) {
          const file = e.clipboardData.items[i].getAsFile();
          if (file) {
            // In dual mode, paste to the slot that doesn't have an image yet
            const targetSlot = isDualMode && !firstImage ? 'first' : 
                             isDualMode && !secondImage ? 'second' : 'first';
            processFile(file, targetSlot);
            return;
          }
        }
      }
    }
    
    toast.error("No image found in clipboard!");
  };
  
  const processFile = (file: File, slot: 'first' | 'second' = 'first') => {
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file!");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        try {
          const imageData = e.target.result;
          
          if (slot === 'first') {
            setFirstImage(imageData);
            sessionStorage.setItem('firstImage', imageData);
            
            if (!isDualMode) {
              sessionStorage.setItem('imageUploaded', 'true');
              sessionStorage.setItem('image', imageData);
              setHasUploadedImage(true);
              onImageUpload(imageData);
            }
          } else {
            setSecondImage(imageData);
            sessionStorage.setItem('secondImage', imageData);
          }
          
          // If we have both images in dual mode, combine them
          if (isDualMode && ((slot === 'first' && secondImage) || (slot === 'second' && firstImage))) {
            const img1 = slot === 'first' ? imageData : firstImage!;
            const img2 = slot === 'second' ? imageData : secondImage!;
            
            if (onDualImageUpload) {
              onDualImageUpload(img1, img2);
            }
            setHasUploadedImage(true);
          }
          
          toast.success(`Image ${slot === 'first' ? '1' : '2'} uploaded successfully!`);
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
    <div className={`mt-8 w-full relative z-50 ${isDualMode ? 'max-w-4xl' : 'max-w-xl'}`}>
      {/* Mode Toggle */}
      <div className="flex justify-end mb-3">
        {!isDualMode ? (
          <button
            onClick={() => {
              setIsDualMode(true);
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline-offset-2 hover:underline"
          >
            Dual mode
          </button>
        ) : (
          <button
            onClick={() => {
              setIsDualMode(false);
              setSecondImage(null);
              sessionStorage.removeItem('secondImage');
              if (firstImage) {
                onImageUpload(firstImage);
              }
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline-offset-2 hover:underline"
          >
            Single
          </button>
        )}
      </div>

      {!isDualMode ? (
        // Single Image Mode
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
              ) : firstImage ? (
                <Replace className="h-16 w-16 text-unicorn-purple mb-3" />
              ) : (
                <ImageIcon className="h-16 w-16 text-gray-400 mb-3" />
              )}
              
              <h3 className="text-xl font-medium mb-2">
                {isDragging 
                  ? "Drop it like it's hot!" 
                  : firstImage 
                    ? "Replace your screenshot" 
                    : "Upload your screenshot"}
              </h3>
              
              <p className="text-gray-500 mb-4">
                {firstImage 
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
                {firstImage ? "Replace Image" : "Select Image"}
              </Button>
            </div>
            
            <p className="text-sm text-gray-400 mt-4">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      ) : (
        // Dual Image Mode
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Image Slot */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center cursor-pointer min-h-[300px] ${
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
                  <Upload className="h-12 w-12 text-unicorn-purple mb-3 animate-bounce" />
                ) : firstImage ? (
                  <div className="w-full max-w-[200px] mb-3">
                    <img 
                      src={firstImage} 
                      alt="First upload" 
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                )}
                
                <h4 className="text-lg font-medium mb-2">
                  {firstImage ? "Image 1" : "First Image"}
                </h4>
                
                <Button
                  size="sm"
                  className="unicorn-button sparkle-cursor"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  {firstImage ? "Replace" : "Upload"}
                </Button>
              </div>
            </div>
          </div>

          {/* Second Image Slot */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center cursor-pointer min-h-[300px] ${
              isDraggingSecond ? 'border-unicorn-purple bg-unicorn-purple/10' : 'border-gray-300 hover:border-unicorn-purple/50'
            }`}
            onDragOver={handleSecondDragOver}
            onDragLeave={handleSecondDragLeave}
            onDrop={handleSecondDrop}
            onClick={() => secondFileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={secondFileInputRef}
              className="hidden" 
              accept="image/*" 
              onChange={handleSecondFileInput}
            />
            
            <div className="text-center">
              <div className="flex flex-col items-center mb-4">
                {isDraggingSecond ? (
                  <Upload className="h-12 w-12 text-unicorn-purple mb-3 animate-bounce" />
                ) : secondImage ? (
                  <div className="w-full max-w-[200px] mb-3">
                    <img 
                      src={secondImage} 
                      alt="Second upload" 
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <Plus className="h-12 w-12 text-gray-400 mb-3" />
                )}
                
                <h4 className="text-lg font-medium mb-2">
                  {secondImage ? "Image 2" : "Second Image"}
                </h4>
                
                <Button
                  size="sm"
                  className="unicorn-button sparkle-cursor"
                  onClick={(e) => {
                    e.stopPropagation();
                    secondFileInputRef.current?.click();
                  }}
                >
                  {secondImage ? "Replace" : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-400 mt-4 text-center">
        Supports: JPG, PNG, GIF, WebP
        {isDualMode && " • Upload two images to combine them"}
      </p>
    </div>
  );
};

export default ImageUploader;
