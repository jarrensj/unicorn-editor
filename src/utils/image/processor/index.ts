
// Main entry point for image processing utilities
export { processImageDownload } from './download';
export { 
  createCanvas,
  drawBackground, 
  drawBackgroundImage, 
  drawMainImage 
} from './canvas';
export {
  canvasToBlob,
  downloadImage,
  shareImage,
  openImageInNewTab,
  copyToClipboard,
  handleImageAction
} from './share';
export {
  isMobileDevice,
  isIOSSafari
} from './device';
export { composeEditedImage } from './compose';
export {
  drawWatermark,
  WATERMARK_LAYOUT,
  WATERMARK_FONT_FAMILY,
  DEFAULT_WATERMARK_POSITION,
} from './watermark';
export type { WatermarkPosition } from './watermark';
