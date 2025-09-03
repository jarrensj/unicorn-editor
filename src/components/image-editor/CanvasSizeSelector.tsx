import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CanvasSize = {
  id: string;
  label: string;
  width: number;
  height: number;
};

const PRESET_SIZES: CanvasSize[] = [
  { id: "1080x1080", label: "1080×1080", width: 1080, height: 1080 },
  { id: "1920x1080", label: "1920×1080", width: 1920, height: 1080 },
  { id: "1080x1350", label: "1080×1350", width: 1080, height: 1350 },
  { id: "1080x1920", label: "1080×1920", width: 1080, height: 1920 },
  { id: "1800x1200", label: "1800×1200", width: 1800, height: 1200 },
];

type CanvasSizeSelectorProps = {
  value: CanvasSize;
  onChange: (size: CanvasSize) => void;
};

const CanvasSizeSelector = ({ value, onChange }: CanvasSizeSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Canvas Size</h3>
      <Select
        value={value.id}
        onValueChange={(val) => {
          const found = PRESET_SIZES.find((s) => s.id === val);
          if (found) onChange(found);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a size" />
        </SelectTrigger>
        <SelectContent>
          {PRESET_SIZES.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { PRESET_SIZES };
export default CanvasSizeSelector;


