// Nunito is licensed under the SIL Open Font License 1.1
// (bundled via @fontsource/nunito). Safe to embed and redistribute.
export const WATERMARK_FONT_FAMILY = "Nunito";
export const WATERMARK_FONT_WEIGHT = 700;

export const WATERMARK_LAYOUT = {
  fontFamily: WATERMARK_FONT_FAMILY,
  fontWeight: WATERMARK_FONT_WEIGHT,
  fontSizeRatio: 0.042,
  bottomPaddingRatio: 0.045,
  maxWidthRatio: 0.82,
  fillStyle: "rgba(255, 255, 255, 0.92)",
  shadowColor: "rgba(0, 0, 0, 0.5)",
  shadowBlurRatio: 0.22,
  lineHeight: 1.2,
} as const;

export const getWatermarkFontSize = (width: number, height: number): number => {
  return Math.max(14, Math.min(width, height) * WATERMARK_LAYOUT.fontSizeRatio);
};

export const ensureWatermarkFontLoaded = async (): Promise<void> => {
  if (typeof document === "undefined" || !document.fonts) {
    return;
  }

  try {
    await document.fonts.load(
      `${WATERMARK_FONT_WEIGHT} 48px "${WATERMARK_FONT_FAMILY}"`
    );
    await document.fonts.ready;
  } catch {
    // Canvas will fall back to the next available sans-serif face.
  }
};

const wrapWatermarkLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const next = `${current} ${words[i]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[i];
    }
  }

  lines.push(current);
  return lines;
};

export const drawWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  watermarkText?: string
): Promise<void> => {
  const text = watermarkText?.trim();
  if (!text) {
    return;
  }

  await ensureWatermarkFontLoaded();

  const minSide = Math.min(canvas.width, canvas.height);
  const fontSize = getWatermarkFontSize(canvas.width, canvas.height);
  const maxWidth = canvas.width * WATERMARK_LAYOUT.maxWidthRatio;
  const bottomPadding = minSide * WATERMARK_LAYOUT.bottomPaddingRatio;

  ctx.save();
  ctx.font = `${WATERMARK_FONT_WEIGHT} ${fontSize}px "${WATERMARK_FONT_FAMILY}", sans-serif`;
  ctx.fillStyle = WATERMARK_LAYOUT.fillStyle;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.shadowColor = WATERMARK_LAYOUT.shadowColor;
  ctx.shadowBlur = fontSize * WATERMARK_LAYOUT.shadowBlurRatio;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(1, fontSize * 0.08);

  const lines = wrapWatermarkLines(ctx, text, maxWidth);
  const lineHeight = fontSize * WATERMARK_LAYOUT.lineHeight;
  const centerX = canvas.width / 2;
  const lastLineY = canvas.height - bottomPadding;

  lines.forEach((line, index) => {
    const lineY = lastLineY - (lines.length - 1 - index) * lineHeight;
    ctx.fillText(line, centerX, lineY, maxWidth);
  });

  ctx.restore();
};
