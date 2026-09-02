import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Type } from "lucide-react";
import {
  WATERMARK_HORIZONTAL,
  WATERMARK_NUDGE_STEP,
  WATERMARK_POSITION_MAX,
  WATERMARK_POSITION_MIN,
  WATERMARK_VERTICAL,
  canNudgeWatermark,
  clampWatermarkValue,
  getMatchingPreset,
  getPresetPosition,
  normalizeWatermarkPosition,
  nudgeWatermarkPosition,
  type WatermarkHorizontal,
  type WatermarkPosition,
  type WatermarkVertical,
} from "@/utils/image/processor/watermark";

type WatermarkInputProps = {
  value: string;
  onChange: (value: string) => void;
  position: WatermarkPosition;
  onPositionChange: (position: WatermarkPosition) => void;
};

const POSITION_LABELS: Record<WatermarkVertical, Record<WatermarkHorizontal, string>> = {
  top: { left: "Top left", center: "Top", right: "Top right" },
  middle: { left: "Left", center: "Center", right: "Right" },
  bottom: { left: "Bottom left", center: "Bottom", right: "Bottom right" },
};

const formatPercent = (value: number): string => `${Math.round(value)}%`;

const WatermarkInput = ({ value, onChange, position, onPositionChange }: WatermarkInputProps) => {
  const safePosition = normalizeWatermarkPosition(position);
  const matchingPreset = getMatchingPreset(safePosition);
  const positionLabel = matchingPreset
    ? POSITION_LABELS[matchingPreset.vertical][matchingPreset.horizontal]
    : `${formatPercent(safePosition.x)}, ${formatPercent(safePosition.y)}`;

  const move = (direction: "up" | "down" | "left" | "right") => {
    onPositionChange(nudgeWatermarkPosition(safePosition, direction, WATERMARK_NUDGE_STEP));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Watermark</span>
      </div>
      <div className="relative">
        <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type watermark text…"
          maxLength={80}
          aria-label="Watermark text"
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Position</span>
          <span className="text-xs text-gray-500">{positionLabel}</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Move watermark left"
            disabled={!canNudgeWatermark(safePosition, "left")}
            onClick={() => move("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Move watermark up"
              disabled={!canNudgeWatermark(safePosition, "up")}
              onClick={() => move("up")}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Watermark position presets">
              {WATERMARK_VERTICAL.map((vertical) =>
                WATERMARK_HORIZONTAL.map((horizontal) => {
                  const selected =
                    matchingPreset?.horizontal === horizontal &&
                    matchingPreset?.vertical === vertical;
                  const label = POSITION_LABELS[vertical][horizontal];
                  return (
                    <button
                      key={`${vertical}-${horizontal}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={label}
                      onClick={() => onPositionChange(getPresetPosition(horizontal, vertical))}
                      className={`h-6 w-6 rounded-sm border transition-colors ${
                        selected
                          ? "border-unicorn-purple bg-unicorn-purple"
                          : "border-gray-300 bg-white hover:border-unicorn-purple/60"
                      }`}
                    />
                  );
                })
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Move watermark down"
              disabled={!canNudgeWatermark(safePosition, "down")}
              onClick={() => move("down")}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Move watermark right"
            disabled={!canNudgeWatermark(safePosition, "right")}
            onClick={() => move("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-gray-600">Horizontal</span>
              <span className="text-xs text-gray-500">{formatPercent(safePosition.x)}</span>
            </div>
            <Slider
              min={WATERMARK_POSITION_MIN}
              max={WATERMARK_POSITION_MAX}
              step={1}
              value={[safePosition.x]}
              onValueChange={([x]) =>
                onPositionChange({ ...safePosition, x: clampWatermarkValue(x) })
              }
              aria-label="Watermark horizontal position"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-gray-600">Vertical</span>
              <span className="text-xs text-gray-500">{formatPercent(safePosition.y)}</span>
            </div>
            <Slider
              min={WATERMARK_POSITION_MIN}
              max={WATERMARK_POSITION_MAX}
              step={1}
              value={[safePosition.y]}
              onValueChange={([y]) =>
                onPositionChange({ ...safePosition, y: clampWatermarkValue(y) })
              }
              aria-label="Watermark vertical position"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Arrows nudge 2% at a time. Sliders give 1% control. Copy and download use the same placement.
      </p>
    </div>
  );
};

export default WatermarkInput;
