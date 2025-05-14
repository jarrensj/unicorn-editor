
// Helper functions for canvas operations
export const createCanvas = (
  imageElement: HTMLImageElement,
  squareFormat: boolean = true
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; width: number; height: number } => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  
  // Set canvas dimensions based on original image
  let width = imageElement.width;
  let height = imageElement.height;

  // If square format is requested, use the larger dimension
  if (squareFormat) {
    const size = Math.max(width, height);
    canvas.width = size;
    canvas.height = size;
    width = size;
    height = size;
  } else {
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
  imageScale: number = 100
): void => {
  // Apply scaling when drawing the main image
  const scaleFactor = imageScale / 100;
  
  // Calculate dimensions to ensure image fits within the canvas
  const maxWidth = canvas.width * 0.95; // 95% of canvas width
  const maxHeight = canvas.height * 0.95; // 95% of canvas height
  
  let scaledWidth = img.width * scaleFactor;
  let scaledHeight = img.height * scaleFactor;
  
  // If image is too large even after scaling, adjust further
  if (scaledWidth > maxWidth || scaledHeight > maxHeight) {
    const widthRatio = maxWidth / scaledWidth;
    const heightRatio = maxHeight / scaledHeight;
    const additionalScale = Math.min(widthRatio, heightRatio);
    
    scaledWidth *= additionalScale;
    scaledHeight *= additionalScale;
  }
  
  // Position the image in the center of the canvas
  const offsetX = (canvas.width - scaledWidth) / 2;
  const offsetY = (canvas.height - scaledHeight) / 2;
  
  // Draw image with scaling
  ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
};
