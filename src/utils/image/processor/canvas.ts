
// Helper functions for canvas operations
export const createCanvas = (
  imageElement: HTMLImageElement,
  squareFormat: boolean = true,
  targetSize?: { width: number; height: number }
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; width: number; height: number } => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  
  // Set canvas dimensions based on provided target or original image
  let width = imageElement.width;
  let height = imageElement.height;

  // Priority: targetSize first, then squareFormat, then original dimensions
  if (targetSize && targetSize.width > 0 && targetSize.height > 0) {
    // Use the exact target dimensions specified
    canvas.width = targetSize.width;
    canvas.height = targetSize.height;
    width = targetSize.width;
    height = targetSize.height;
  } else if (squareFormat) {
    // Square format - use the larger dimension
    const size = Math.max(width, height);
    canvas.width = size;
    canvas.height = size;
    width = size;
    height = size;
  } else {
    // Use original image dimensions
    canvas.width = width;
    canvas.height = height;
  }
  
  return { canvas, ctx, width, height };
};

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  selectedBackground: string
): void => {
  if (selectedBackground === "transparent") {
    return;
  }
  
  if (selectedBackground.startsWith("linear-gradient")) {
    // Check if it's a diagonal gradient (135deg)
    const isDiagonal = selectedBackground.includes("135deg");
    
    let gradient;
    if (isDiagonal) {
      // For diagonal gradients (top-left to bottom-right)
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    } else {
      // For horizontal gradients
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    }
    
    // Parse the gradient colors from the CSS string
    if (selectedBackground.includes('#fef6ff') || selectedBackground.includes('#ffebb8')) {
      // Lighter Rainbow gradient with yellow/orange tones
      gradient.addColorStop(0, '#fef6ff');    // Very light purple
      gradient.addColorStop(0.25, '#ffebb8');  // Light yellow/orange
      gradient.addColorStop(0.6, '#ffdee2');   // Light pink
      gradient.addColorStop(1, '#d8f1ff');     // Light blue
    } else if (selectedBackground.includes('#ffd7f5') && selectedBackground.includes('#fff0fa')) {
      // Softer Pink gradient
      gradient.addColorStop(0, '#ffd7f5');
      gradient.addColorStop(1, '#fff0fa');
    } else if (selectedBackground.includes('#d3e4fd') && selectedBackground.includes('#eef9ff')) {
      // New Soft Blue gradient
      gradient.addColorStop(0, '#d3e4fd');
      gradient.addColorStop(1, '#eef9ff');
    } else if (selectedBackground.includes('#fff3e6') && selectedBackground.includes('#ffd7b5')) {
      // New Soft Peach gradient
      gradient.addColorStop(0, '#fff3e6');    // Very light peach
      gradient.addColorStop(0.4, '#ffd7b5');  // Medium peach
      gradient.addColorStop(1, '#ffe8cc');    // Light warm peach
    } else if (selectedBackground.includes('#ee9ca7')) {
      // Pastel gradient
      gradient.addColorStop(0, '#ee9ca7');
      gradient.addColorStop(1, '#ffdde1');
    } else if (selectedBackground.includes('#9b87f5')) {
      // Original Rainbow gradient (for backward compatibility)
      gradient.addColorStop(0, '#9b87f5');  // Purple
      gradient.addColorStop(0.33, '#D946EF'); // Magenta
      gradient.addColorStop(0.66, '#FFDEE2'); // Pink
      gradient.addColorStop(1, '#33C3F0');   // Blue
    } else if (selectedBackground.includes('unicorn-purple')) {
      // Purple to magenta gradient
      gradient.addColorStop(0, '#9b87f5');
      gradient.addColorStop(1, '#D946EF');
    } else if (selectedBackground.includes('unicorn-skyBlue')) {
      // Sky blue to purple gradient
      gradient.addColorStop(0, '#33C3F0');
      gradient.addColorStop(1, '#9b87f5');
    } else {
      // Default fallback gradient
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#e9ecef');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Solid color
    ctx.fillStyle = selectedBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

export const drawBackgroundImage = (
  ctx: CanvasRenderingContext2D,
  bgImg: HTMLImageElement,
  canvas: HTMLCanvasElement
): void => {
  // Fill the entire canvas with the background
  ctx.fillStyle = "#FFFFFF"; // White base color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the background image with cover positioning
  const bgAspect = bgImg.width / bgImg.height;
  const canvasAspect = canvas.width / canvas.height;
  
  let drawWidth, drawHeight, x, y;
  
  if (bgAspect > canvasAspect) {
    // Background image is wider
    drawHeight = canvas.height;
    drawWidth = drawHeight * bgAspect;
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  } else {
    // Background image is taller
    drawWidth = canvas.width;
    drawHeight = drawWidth / bgAspect;
    x = 0;
    y = (canvas.height - drawHeight) / 2;
  }
  
  ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);
};

export const drawMainImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  imageScale: number = 100,
  cornerRadius: number = 0
): void => {
  // Exactly match the preview CSS behavior:
  // 1. object-contain (fit image in container maintaining aspect ratio)
  // 2. maxWidth: 95%, maxHeight: 95% (constrain to 95% of container)  
  // 3. transform: scale(imageScale/100) (apply user scale on top)
  
  const scaleFactor = imageScale / 100;
  
  // Step 1: object-contain behavior - fit image in canvas maintaining aspect ratio
  const imageAspect = img.width / img.height;
  const canvasAspect = canvas.width / canvas.height;
  
  let containedWidth, containedHeight;
  
  if (imageAspect > canvasAspect) {
    // Image is wider - fit by width
    containedWidth = canvas.width;
    containedHeight = canvas.width / imageAspect;
  } else {
    // Image is taller - fit by height
    containedHeight = canvas.height;
    containedWidth = canvas.height * imageAspect;
  }
  
  // Step 2: Apply 95% constraint (like CSS maxWidth/maxHeight: 95%)
  const maxWidth = canvas.width * 0.95;
  const maxHeight = canvas.height * 0.95;
  
  if (containedWidth > maxWidth) {
    const ratio = maxWidth / containedWidth;
    containedWidth = maxWidth;
    containedHeight *= ratio;
  }
  
  if (containedHeight > maxHeight) {
    const ratio = maxHeight / containedHeight;
    containedHeight = maxHeight;
    containedWidth *= ratio;
  }
  
  // Step 3: Apply user scale (like CSS transform: scale())
  const finalWidth = containedWidth * scaleFactor;
  const finalHeight = containedHeight * scaleFactor;
  
  // Center the image
  const offsetX = (canvas.width - finalWidth) / 2;
  const offsetY = (canvas.height - finalHeight) / 2;
  
  // Save the current context state
  ctx.save();
  
  // Apply corner radius if specified
  if (cornerRadius > 0) {
    // Create a clipping path with rounded corners
    ctx.beginPath();
    ctx.roundRect(offsetX, offsetY, finalWidth, finalHeight, cornerRadius);
    ctx.clip();
  }
  
  // Draw image with scaling
  ctx.drawImage(img, offsetX, offsetY, finalWidth, finalHeight);
  
  // Restore context state
  ctx.restore();
};

// Combine two images side by side into a single image
export const combineImages = (
  image1DataUrl: string,
  image2DataUrl: string,
  cornerRadius: number = 0
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img1 = new Image();
    const img2 = new Image();
    let loadedCount = 0;
    
    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        try {
          // Calculate dimensions for side-by-side layout with gap
          const gap = 20; // 20px gap between images
          const maxHeight = Math.max(img1.height, img2.height);
          const totalWidth = img1.width + img2.width + gap;
          
          // Create canvas for combined image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          canvas.width = totalWidth;
          canvas.height = maxHeight;
          
          // Keep background transparent - don't fill with any color
          // The gap between images will be transparent
          
          // Draw first image on the left with corner radius
          const img1Y = (maxHeight - img1.height) / 2;
          ctx.save();
          if (cornerRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(0, img1Y, img1.width, img1.height, cornerRadius);
            ctx.clip();
          }
          ctx.drawImage(img1, 0, img1Y);
          ctx.restore();
          
          // Draw second image on the right (with gap) with corner radius
          const img2Y = (maxHeight - img2.height) / 2;
          const img2X = img1.width + gap;
          ctx.save();
          if (cornerRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(img2X, img2Y, img2.width, img2.height, cornerRadius);
            ctx.clip();
          }
          ctx.drawImage(img2, img2X, img2Y);
          ctx.restore();
          
          // Convert to data URL
          const combinedDataUrl = canvas.toDataURL('image/png');
          resolve(combinedDataUrl);
        } catch (error) {
          reject(error);
        }
      }
    };
    
    const onImageError = () => {
      reject(new Error('Failed to load one or both images'));
    };
    
    img1.onload = onImageLoad;
    img1.onerror = onImageError;
    img2.onload = onImageLoad;
    img2.onerror = onImageError;
    
    img1.src = image1DataUrl;
    img2.src = image2DataUrl;
  });
};
