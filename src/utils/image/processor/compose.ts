import { createCanvas, drawBackground, drawBackgroundImage, drawMainImage } from "./canvas";
import { DEFAULT_WATERMARK_POSITION, drawWatermark, type WatermarkPosition } from "./watermark";

export type ComposeImageParams = {
  imageElement: HTMLImageElement;
  selectedBackground: string;
  backgroundImage: string | null;
  imageScale: number;
  imageCornerRadius: number;
  frameCornerRadius: number;
  targetSize?: { width: number; height: number };
  watermarkText?: string;
  watermarkPosition?: WatermarkPosition;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });

export const applyFrameCornerRadius = (
  canvas: HTMLCanvasElement,
  frameCornerRadius: number
): HTMLCanvasElement => {
  if (frameCornerRadius <= 0) {
    return canvas;
  }

  const roundedCanvas = document.createElement("canvas");
  const roundedCtx = roundedCanvas.getContext("2d");

  if (!roundedCtx) {
    return canvas;
  }

  roundedCanvas.width = canvas.width;
  roundedCanvas.height = canvas.height;
  roundedCtx.beginPath();
  roundedCtx.roundRect(0, 0, canvas.width, canvas.height, frameCornerRadius);
  roundedCtx.clip();
  roundedCtx.drawImage(canvas, 0, 0);

  return roundedCanvas;
};

export const composeEditedImage = async (
  params: ComposeImageParams
): Promise<HTMLCanvasElement> => {
  const {
    imageElement,
    selectedBackground,
    backgroundImage,
    imageScale,
    imageCornerRadius,
    frameCornerRadius,
    targetSize,
    watermarkText,
    watermarkPosition = DEFAULT_WATERMARK_POSITION,
  } = params;

  const { canvas, ctx } = createCanvas(imageElement, true, targetSize);

  if (backgroundImage) {
    const bgImg = await loadImage(backgroundImage);
    drawBackgroundImage(ctx, bgImg, canvas);
  } else {
    drawBackground(ctx, canvas, selectedBackground);
  }

  drawMainImage(ctx, imageElement, canvas, imageScale, imageCornerRadius);
  await drawWatermark(ctx, canvas, watermarkText, watermarkPosition);

  return applyFrameCornerRadius(canvas, frameCornerRadius);
};
