
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackgroundSelector from "./image-editor/BackgroundSelector";
import ImagePreview from "./image-editor/ImagePreview";
import EditorHeading from "./image-editor/EditorHeading";
import { processImageDownload } from "@/utils/imageProcessor"; // Keeping original import path for backward compatibility
import CanvasSizeSelector, { type CanvasSize } from "./image-editor/CanvasSizeSelector";
import { combineImages } from "@/utils/image/processor/canvas";

type ImageEditorProps = {
  initialImageUrl?: string | null;
  isDualMode?: boolean;
  originalImages?: { image1: string; image2: string } | null;
};

const ImageEditor = ({ initialImageUrl, isDualMode = false, originalImages = null }: ImageEditorProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  // Update to use the first background option from BackgroundSelector
  const [selectedBackground, setSelectedBackground] = useState<string>("linear-gradient(135deg, #fef6ff, #ffebb8, #ffdee2, #d8f1ff)");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageScale, setImageScale] = useState<number>(85); // Default to 85% scale to ensure it fits
  const [imageCornerRadius, setImageCornerRadius] = useState<number>(0); // Corner radius for the uploaded image
  const [frameCornerRadius, setFrameCornerRadius] = useState<number>(0); // Corner radius for the entire frame
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ id: "1080x1080", label: "1080×1080", width: 1080, height: 1080 });
  
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
  
  // Recombine images when corner radius changes in dual mode
  useEffect(() => {
    if (isDualMode && originalImages) {
      const recombine = async () => {
        try {
          const combined = await combineImages(originalImages.image1, originalImages.image2, imageCornerRadius);
          setImageUrl(combined);
          
          // Update image element
          const img = new Image();
          img.onload = () => setImageElement(img);
          img.src = combined;
        } catch (error) {
          console.error("Error recombining images:", error);
        }
      };
      
      recombine();
    }
  }, [imageCornerRadius, isDualMode, originalImages]);
  
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
  
  const handleImageCornerRadiusChange = (radius: number) => {
    setImageCornerRadius(radius);
  };

  const handleFrameCornerRadiusChange = (radius: number) => {
    setFrameCornerRadius(radius);
  };
  
  const handleDownload = () => {
    // Pass target size and both corner radius values
    // In dual mode, corner radius is already applied to individual images, so pass 0
    processImageDownload(
      imageUrl,
      imageElement,
      selectedBackground,
      backgroundImage,
      imageScale,
      true,
      isDualMode ? 0 : imageCornerRadius,
      frameCornerRadius,
      { width: canvasSize.width, height: canvasSize.height }
    );
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
              imageCornerRadius={imageCornerRadius}
              frameCornerRadius={frameCornerRadius}
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
              isDualMode={isDualMode}
            />
            <div>
              <h3 className="text-xl font-semibold mb-4">Background Options</h3>
              <div className="mb-6">
                <CanvasSizeSelector value={canvasSize} onChange={setCanvasSize} />
              </div>
              <BackgroundSelector 
                onSelect={handleBackgroundChange} 
                onImageUpload={handleBackgroundImageUpload}
                initialBackground={selectedBackground}
                imageUrl={imageUrl}
                imageScale={imageScale}
                onScaleChange={handleScaleChange}
                imageCornerRadius={imageCornerRadius}
                frameCornerRadius={frameCornerRadius}
                onImageCornerRadiusChange={handleImageCornerRadiusChange}
                onFrameCornerRadiusChange={handleFrameCornerRadiusChange}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageEditor;
