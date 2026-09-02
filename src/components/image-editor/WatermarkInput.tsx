import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Type } from "lucide-react";
import {
  canNudgeWatermark,
  nudgeWatermarkPosition,
  type WatermarkHorizontal,
  type WatermarkPosition,
  type WatermarkVertical,
  WATERMARK_HORIZONTAL,
  WATERMARK_VERTICAL,
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

const WatermarkInput = ({ value, onChange, position, onPositionChange }: WatermarkInputProps) => {
  const move = (direction: "up" | "down" | "left" | "right") => {
    onPositionChange(nudgeWatermarkPosition(position, direction));
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Position</span>
          <span className="text-xs text-gray-500">
            {POSITION_LABELS[position.vertical][position.horizontal]}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Move watermark left"
            disabled={!canNudgeWatermark(position, "left")}
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
              disabled={!canNudgeWatermark(position, "up")}
              onClick={() => move("up")}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Watermark position">
              {WATERMARK_VERTICAL.map((vertical) =>
                WATERMARK_HORIZONTAL.map((horizontal) => {
                  const selected =
                    position.horizontal === horizontal && position.vertical === vertical;
                  const label = POSITION_LABELS[vertical][horizontal];
                  return (
                    <button
                      key={`${vertical}-${horizontal}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={label}
                      onClick={() => onPositionChange({ horizontal, vertical })}
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
              disabled={!canNudgeWatermark(position, "down")}
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
            disabled={!canNudgeWatermark(position, "right")}
            onClick={() => move("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Move the watermark with the arrows or the grid. The same position is used for copy and download.
      </p>
    </div>
  );
};

export default WatermarkInput;
