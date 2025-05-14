
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackgroundSelector from "./image-editor/BackgroundSelector";
import ImagePreview from "./image-editor/ImagePreview";
import EditorHeading from "./image-editor/EditorHeading";
import { processImageDownload } from "@/utils/imageProcessor"; // Keeping original import path for backward compatibility

type ImageEditorProps = {
  initialImageUrl?: string | null;
};

const ImageEditor = ({ initialImageUrl }: ImageEditorProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  // Update to use the first background option from BackgroundSelector
  const [selectedBackground, setSelectedBackground] = useState<string>("linear-gradient(135deg, #fef6ff, #ffebb8, #ffdee2, #d8f1ff)");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageScale, setImageScale] = useState<number>(85); // Default to 85% scale to ensure it fits
  
  // Load the image from props only, not localStorage
  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
      
      // Create an image element to use for dimensions
      const img = new Image();
      img.onload = () => setImageElement(img);
      img.src = initialImageUrl;
    }
  }, [initialImageUrl]);
  
  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background);
    setBackgroundImage(null);
  };

  const handleBackgroundImageUpload = (imageDataUrl: string) => {
    setBackgroundImage(imageDataUrl);
    setSelectedBackground('none');
  };
  
  const handleScaleChange = (scale: number) => {
    setImageScale(scale);
  };
  
  const handleDownload = () => {
    // Always use square format (true)
    processImageDownload(imageUrl, imageElement, selectedBackground, backgroundImage, imageScale, true);
  };
  
  return (
    <section id="editor" className="py-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-unicorn-skyBlue/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-unicorn-purple/10 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-4xl mx-auto">
        <EditorHeading />
        
        <motion.div
          className="unicorn-card p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <ImagePreview 
              imageUrl={imageUrl}
              selectedBackground={selectedBackground}
              backgroundImage={backgroundImage}
              onDownload={handleDownload}
              imageScale={imageScale}
            />
            <div>
              <h3 className="text-xl font-semibold mb-4">Background Options</h3>
              <BackgroundSelector 
                onSelect={handleBackgroundChange} 
                onImageUpload={handleBackgroundImageUpload}
                initialBackground={selectedBackground}
                imageUrl={imageUrl}
                imageScale={imageScale}
                onScaleChange={handleScaleChange}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageEditor;
