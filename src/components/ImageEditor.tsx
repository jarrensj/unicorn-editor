
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackgroundSelector from "./image-editor/BackgroundSelector";
import ImagePreview from "./image-editor/ImagePreview";
import EditorHeading from "./image-editor/EditorHeading";
import { processImageDownload } from "@/utils/imageProcessor"; // Keeping original import path for backward compatibility
import CanvasSizeSelector, { type CanvasSize } from "./image-editor/CanvasSizeSelector";
import { useLastSelectedBackground } from "@/hooks/useLastSelectedBackground";
import {
  DEFAULT_WATERMARK_POSITION,
  type WatermarkPosition,
} from "@/utils/image/processor/watermark";

type ImageEditorProps = {
  initialImageUrl?: string | null;
};

const ImageEditor = ({ initialImageUrl }: ImageEditorProps) => {
  const { lastSelected, saveLastSelected } = useLastSelectedBackground();
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  
  // Initialize with last selected background or default to rainbow gradient
  const [selectedBackground, setSelectedBackground] = useState<string>(
    lastSelected?.type === "standard" ? lastSelected.value : "linear-gradient(135deg, #fef6ff, #ffebb8, #ffdee2, #d8f1ff)"
  );
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    lastSelected?.type === "custom" ? lastSelected.value : null
  );
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageScale, setImageScale] = useState<number>(85); // Default to 85% scale to ensure it fits
  const [imageCornerRadius, setImageCornerRadius] = useState<number>(0); // Corner radius for the uploaded image
  const [frameCornerRadius, setFrameCornerRadius] = useState<number>(0); // Corner radius for the entire frame
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ id: "1080x1080", label: "1080×1080", width: 1080, height: 1080 });
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>(
    DEFAULT_WATERMARK_POSITION
  );
  
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
  
  const handleBackgroundChange = (background: string, backgroundId: string) => {
    setSelectedBackground(background);
    setBackgroundImage(null);
    // Save as last selected standard background
    saveLastSelected({
      type: "standard",
      id: backgroundId,
      value: background,
    });
  };

  const handleBackgroundImageUpload = (imageDataUrl: string, imageId: string) => {
    setBackgroundImage(imageDataUrl);
    setSelectedBackground('none');
    // Save as last selected custom background
    saveLastSelected({
      type: "custom",
      id: imageId,
      value: imageDataUrl,
    });
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
    processImageDownload(
      imageUrl,
      imageElement,
      selectedBackground,
      backgroundImage,
      imageScale,
      true,
      imageCornerRadius,
      frameCornerRadius,
      { width: canvasSize.width, height: canvasSize.height },
      watermarkText,
      watermarkPosition
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
              watermarkText={watermarkText}
              watermarkPosition={watermarkPosition}
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
                lastSelectedBackground={lastSelected}
                imageUrl={imageUrl}
                imageScale={imageScale}
                onScaleChange={handleScaleChange}
                imageCornerRadius={imageCornerRadius}
                frameCornerRadius={frameCornerRadius}
                onImageCornerRadiusChange={handleImageCornerRadiusChange}
                onFrameCornerRadiusChange={handleFrameCornerRadiusChange}
                watermarkText={watermarkText}
                onWatermarkTextChange={setWatermarkText}
                watermarkPosition={watermarkPosition}
                onWatermarkPositionChange={setWatermarkPosition}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageEditor;
