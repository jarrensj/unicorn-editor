
// Helper functions for canvas operations
export const setupImageCanvas = (
  img: HTMLImageElement,
  imageScale: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; size: number } => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }
  
  // Set canvas to square format using larger dimension
  const size = Math.max(img.width, img.height);
  canvas.width = size;
  canvas.height = size;
  
  return { canvas, ctx, size };
};

// Draw the main image onto the canvas with proper scaling and positioning
export const drawMainImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  imageScale: number
): void => {
  const scaleFactor = imageScale / 100;
  const scaledWidth = img.width * scaleFactor;
  const scaledHeight = img.height * scaleFactor;
  const offsetX = (canvas.width - scaledWidth) / 2;
  const offsetY = (canvas.height - scaledHeight) / 2;
  
  ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
};

// Draw background image with cover positioning
export const drawBackgroundImage = (
  ctx: CanvasRenderingContext2D,
  bgImg: HTMLImageElement,
  canvas: HTMLCanvasElement
): void => {
  // Fill canvas with white first to ensure no transparency issues
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Cover positioning for background
  const bgAspect = bgImg.width / bgImg.height;
  const canvasAspect = canvas.width / canvas.height;
  
  let drawWidth, drawHeight, x, y;
  if (bgAspect > canvasAspect) {
    drawHeight = canvas.height;
    drawWidth = drawHeight * bgAspect;
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  } else {
    drawWidth = canvas.width;
    drawHeight = drawWidth / bgAspect;
    x = 0;
    y = (canvas.height - drawHeight) / 2;
  }
  
  ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);
};

// Draw gradient or solid background
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
    
    // Match gradient colors
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
      // Legacy Pastel gradient (for backward compatibility)
      gradient.addColorStop(0, '#ee9ca7');
      gradient.addColorStop(1, '#ffdde1');
    } else if (selectedBackground.includes('#f8e3ff')) {
      // Legacy lighter Rainbow gradient (for backward compatibility)
      gradient.addColorStop(0, '#f8e3ff');  
      gradient.addColorStop(0.33, '#D946EF');
      gradient.addColorStop(0.66, '#FFDEE2');
      gradient.addColorStop(1, '#33C3F0');
    } else if (selectedBackground.includes('#9b87f5')) {
      // Original Rainbow gradient (for backward compatibility)
      gradient.addColorStop(0, '#9b87f5');
      gradient.addColorStop(0.33, '#D946EF');
      gradient.addColorStop(0.66, '#FFDEE2');
      gradient.addColorStop(1, '#33C3F0');
    } else if (selectedBackground.includes('unicorn-purple')) {
      gradient.addColorStop(0, '#9b87f5');
      gradient.addColorStop(1, '#D946EF');
    } else if (selectedBackground.includes('unicorn-skyBlue')) {
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
    ctx.fillStyle = selectedBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};
