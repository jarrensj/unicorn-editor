import type { CSSProperties } from "react";

// Nunito is licensed under the SIL Open Font License 1.1
// (bundled via @fontsource/nunito). Safe to embed and redistribute.
export const WATERMARK_FONT_FAMILY = "Nunito";
export const WATERMARK_FONT_WEIGHT = 700;

export type WatermarkHorizontal = "left" | "center" | "right";
export type WatermarkVertical = "top" | "middle" | "bottom";

export type WatermarkPosition = {
  x: number;
  y: number;
};

export const WATERMARK_POSITION_MIN = 2;
export const WATERMARK_POSITION_MAX = 98;
export const WATERMARK_NUDGE_STEP = 2;
export const WATERMARK_PRESET_INSET = 8;
export const WATERMARK_PRESET_MATCH_TOLERANCE = 2.5;

export const DEFAULT_WATERMARK_POSITION: WatermarkPosition = {
  x: 50,
  y: 100 - WATERMARK_PRESET_INSET,
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

export const clampWatermarkValue = (value: number): number => {
  return Math.min(
    WATERMARK_POSITION_MAX,
    Math.max(WATERMARK_POSITION_MIN, Math.round(value * 10) / 10)
  );
};

export const clampWatermarkPosition = (position: WatermarkPosition): WatermarkPosition => ({
  x: clampWatermarkValue(position.x),
  y: clampWatermarkValue(position.y),
});

export const getPresetPosition = (
  horizontal: WatermarkHorizontal,
  vertical: WatermarkVertical
): WatermarkPosition => {
  const x =
    horizontal === "left"
      ? WATERMARK_PRESET_INSET
      : horizontal === "right"
        ? 100 - WATERMARK_PRESET_INSET
        : 50;
  const y =
    vertical === "top"
      ? WATERMARK_PRESET_INSET
      : vertical === "bottom"
        ? 100 - WATERMARK_PRESET_INSET
        : 50;

  return { x, y };
};

export const getMatchingPreset = (
  position: WatermarkPosition
): { horizontal: WatermarkHorizontal; vertical: WatermarkVertical } | null => {
  for (const vertical of WATERMARK_VERTICAL) {
    for (const horizontal of WATERMARK_HORIZONTAL) {
      const preset = getPresetPosition(horizontal, vertical);
      if (
        Math.abs(preset.x - position.x) <= WATERMARK_PRESET_MATCH_TOLERANCE &&
        Math.abs(preset.y - position.y) <= WATERMARK_PRESET_MATCH_TOLERANCE
      ) {
        return { horizontal, vertical };
      }
    }
  }

  return null;
};

export const getWatermarkFontSize = (width: number, height: number): number => {
  return Math.max(14, Math.min(width, height) * WATERMARK_LAYOUT.fontSizeRatio);
};

export const nudgeWatermarkPosition = (
  position: WatermarkPosition,
  direction: "up" | "down" | "left" | "right",
  step: number = WATERMARK_NUDGE_STEP
): WatermarkPosition => {
  const next = { ...position };

  if (direction === "left") next.x -= step;
  if (direction === "right") next.x += step;
  if (direction === "up") next.y -= step;
  if (direction === "down") next.y += step;

  return clampWatermarkPosition(next);
};

export const canNudgeWatermark = (
  position: WatermarkPosition,
  direction: "up" | "down" | "left" | "right"
): boolean => {
  if (direction === "left") return position.x > WATERMARK_POSITION_MIN;
  if (direction === "right") return position.x < WATERMARK_POSITION_MAX;
  if (direction === "up") return position.y > WATERMARK_POSITION_MIN;
  return position.y < WATERMARK_POSITION_MAX;
};

export const getWatermarkPreviewPlacement = (position: WatermarkPosition): CSSProperties => {
  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  };
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
  const clamped = clampWatermarkPosition(position);

  ctx.save();
  ctx.font = `${WATERMARK_FONT_WEIGHT} ${fontSize}px "${WATERMARK_FONT_FAMILY}", sans-serif`;
  ctx.fillStyle = WATERMARK_LAYOUT.fillStyle;
  ctx.shadowColor = WATERMARK_LAYOUT.shadowColor;
  ctx.shadowBlur = fontSize * WATERMARK_LAYOUT.shadowBlurRatio;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(1, fontSize * 0.08);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const lines = wrapWatermarkLines(ctx, text, maxWidth);
  const blockHeight = (lines.length - 1) * lineHeight + fontSize;
  const centerX = canvas.width * (clamped.x / 100);
  const centerY = canvas.height * (clamped.y / 100);
  const firstLineY = centerY - blockHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, firstLineY + index * lineHeight, maxWidth);
  });

  ctx.restore();
};
