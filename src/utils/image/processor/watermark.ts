import type { CSSProperties } from "react";

// Nunito is licensed under the SIL Open Font License 1.1
// (bundled via @fontsource/nunito). Safe to embed and redistribute.
export const WATERMARK_FONT_FAMILY = "Nunito";
export const WATERMARK_FONT_WEIGHT = 700;

export type WatermarkHorizontal = "left" | "center" | "right";
export type WatermarkVertical = "top" | "middle" | "bottom";

export type WatermarkPosition = {
  horizontal: WatermarkHorizontal;
  vertical: WatermarkVertical;
};

export const DEFAULT_WATERMARK_POSITION: WatermarkPosition = {
  horizontal: "center",
  vertical: "bottom",
};

export const WATERMARK_HORIZONTAL: WatermarkHorizontal[] = ["left", "center", "right"];
export const WATERMARK_VERTICAL: WatermarkVertical[] = ["top", "middle", "bottom"];

export const WATERMARK_LAYOUT = {
  fontFamily: WATERMARK_FONT_FAMILY,
  fontWeight: WATERMARK_FONT_WEIGHT,
  fontSizeRatio: 0.042,
  edgePaddingRatio: 0.045,
  maxWidthRatio: 0.82,
  fillStyle: "rgba(255, 255, 255, 0.92)",
  shadowColor: "rgba(0, 0, 0, 0.5)",
  shadowBlurRatio: 0.22,
  lineHeight: 1.2,
} as const;

export const getWatermarkFontSize = (width: number, height: number): number => {
  return Math.max(14, Math.min(width, height) * WATERMARK_LAYOUT.fontSizeRatio);
};

export const nudgeWatermarkPosition = (
  position: WatermarkPosition,
  direction: "up" | "down" | "left" | "right"
): WatermarkPosition => {
  const next = { ...position };

  if (direction === "left" || direction === "right") {
    const index = WATERMARK_HORIZONTAL.indexOf(position.horizontal);
    const nextIndex = direction === "left" ? index - 1 : index + 1;
    if (nextIndex >= 0 && nextIndex < WATERMARK_HORIZONTAL.length) {
      next.horizontal = WATERMARK_HORIZONTAL[nextIndex];
    }
  } else {
    const index = WATERMARK_VERTICAL.indexOf(position.vertical);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex >= 0 && nextIndex < WATERMARK_VERTICAL.length) {
      next.vertical = WATERMARK_VERTICAL[nextIndex];
    }
  }

  return next;
};

export const canNudgeWatermark = (
  position: WatermarkPosition,
  direction: "up" | "down" | "left" | "right"
): boolean => {
  if (direction === "left") return position.horizontal !== "left";
  if (direction === "right") return position.horizontal !== "right";
  if (direction === "up") return position.vertical !== "top";
  return position.vertical !== "bottom";
};

export const getWatermarkPreviewPlacement = (position: WatermarkPosition) => {
  const inset = `${WATERMARK_LAYOUT.edgePaddingRatio * 100}cqmin`;
  const style: CSSProperties = {
    textAlign: position.horizontal,
  };

  if (position.horizontal === "left") {
    style.left = inset;
  } else if (position.horizontal === "right") {
    style.right = inset;
  } else {
    style.left = "50%";
    style.transform = "translateX(-50%)";
  }

  if (position.vertical === "top") {
    style.top = inset;
  } else if (position.vertical === "bottom") {
    style.bottom = inset;
  } else {
    style.top = "50%";
    style.transform = style.transform
      ? `${style.transform} translateY(-50%)`
      : "translateY(-50%)";
  }

  return style;
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

const getWatermarkAnchor = (
  canvas: HTMLCanvasElement,
  position: WatermarkPosition,
  lineCount: number,
  fontSize: number,
  lineHeight: number
): { x: number; textAlign: CanvasTextAlign; firstLineY: number; textBaseline: CanvasTextBaseline } => {
  const padding = Math.min(canvas.width, canvas.height) * WATERMARK_LAYOUT.edgePaddingRatio;
  const blockHeight = (lineCount - 1) * lineHeight + fontSize;

  let x: number;
  let textAlign: CanvasTextAlign;
  if (position.horizontal === "left") {
    x = padding;
    textAlign = "left";
  } else if (position.horizontal === "right") {
    x = canvas.width - padding;
    textAlign = "right";
  } else {
    x = canvas.width / 2;
    textAlign = "center";
  }

  let firstLineY: number;
  if (position.vertical === "top") {
    firstLineY = padding;
  } else if (position.vertical === "bottom") {
    firstLineY = canvas.height - padding - blockHeight;
  } else {
    firstLineY = (canvas.height - blockHeight) / 2;
  }

  return { x, textAlign, firstLineY, textBaseline: "top" };
};

export const drawWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  watermarkText?: string,
  position: WatermarkPosition = DEFAULT_WATERMARK_POSITION
): Promise<void> => {
  const text = watermarkText?.trim();
  if (!text) {
    return;
  }

  await ensureWatermarkFontLoaded();

  const fontSize = getWatermarkFontSize(canvas.width, canvas.height);
  const maxWidth = canvas.width * WATERMARK_LAYOUT.maxWidthRatio;
  const lineHeight = fontSize * WATERMARK_LAYOUT.lineHeight;

  ctx.save();
  ctx.font = `${WATERMARK_FONT_WEIGHT} ${fontSize}px "${WATERMARK_FONT_FAMILY}", sans-serif`;
  ctx.fillStyle = WATERMARK_LAYOUT.fillStyle;
  ctx.shadowColor = WATERMARK_LAYOUT.shadowColor;
  ctx.shadowBlur = fontSize * WATERMARK_LAYOUT.shadowBlurRatio;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(1, fontSize * 0.08);

  const lines = wrapWatermarkLines(ctx, text, maxWidth);
  const { x, textAlign, firstLineY, textBaseline } = getWatermarkAnchor(
    canvas,
    position,
    lines.length,
    fontSize,
    lineHeight
  );

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, firstLineY + index * lineHeight, maxWidth);
  });

  ctx.restore();
};
