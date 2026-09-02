import { Input } from "@/components/ui/input";
import { Type } from "lucide-react";

type WatermarkInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const WatermarkInput = ({ value, onChange }: WatermarkInputProps) => {
  return (
    <div className="space-y-2">
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
      <p className="text-xs text-gray-500">
        Shown on the preview and included in copy and download.
      </p>
    </div>
  );
};

export default WatermarkInput;
