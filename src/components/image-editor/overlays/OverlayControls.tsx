import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Square, ImagePlus, Trash2 } from "lucide-react";
import type { Overlay } from "@/types/overlay";

type OverlayControlsProps = {
  overlays: Overlay[];
  selectedOverlayId: string | null;
  onAddOverlay: (overlay: Overlay) => void;
  onUpdateOverlay: (id: string, updates: Partial<Overlay>) => void;
  onDeleteOverlay: (id: string) => void;
  onClearOverlays: () => void;
};

const COLORS = ["#000000", "#ffffff", "#ef4444", "#3b82f6", "#22c55e", "#eab308"];

const OverlayControls = ({
  overlays,
  selectedOverlayId,
  onAddOverlay,
  onUpdateOverlay,
  onDeleteOverlay,
  onClearOverlays,
}: OverlayControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSquare = () => {
    const id = `overlay-${Date.now()}`;
    onAddOverlay({
      id,
      type: "square",
      x: 30,
      y: 30,
      width: 20,
      height: 20,
      color: "#000000",
    });
  };

  const addImageOverlay = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target && typeof ev.target.result === "string") {
        const id = `overlay-${Date.now()}`;
        onAddOverlay({
          id,
          type: "image",
          x: 25,
          y: 25,
          width: 25,
          height: 25,
          imageUrl: ev.target.result,
        });
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedOverlay = overlays.find((o) => o.id === selectedOverlayId);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Overlays</h3>

      {/* Add buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addSquare} className="flex-1">
          <Square className="h-4 w-4 mr-1" />
          Add Block
        </Button>
        <Button variant="outline" size="sm" onClick={addImageOverlay} className="flex-1">
          <ImagePlus className="h-4 w-4 mr-1" />
          Add Image
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Color picker for selected square overlay */}
      {selectedOverlay?.type === "square" && (
        <div className="space-y-1">
          <span className="text-xs text-gray-500">Block Color</span>
          <div className="flex gap-1.5">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onUpdateOverlay(selectedOverlay.id, { color })}
                className="rounded-full border transition-transform"
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderColor: selectedOverlay.color === color ? "#3b82f6" : "#d1d5db",
                  borderWidth: selectedOverlay.color === color ? 2 : 1,
                  transform: selectedOverlay.color === color ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
            <input
              type="color"
              value={selectedOverlay.color || "#000000"}
              onChange={(e) => onUpdateOverlay(selectedOverlay.id, { color: e.target.value })}
              className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer p-0"
              style={{ appearance: "none", WebkitAppearance: "none" }}
              title="Custom color"
            />
          </div>
        </div>
      )}

      {/* Overlay count and clear */}
      {overlays.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {overlays.length} overlay{overlays.length !== 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearOverlays}
            className="h-7 text-xs text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default OverlayControls;
