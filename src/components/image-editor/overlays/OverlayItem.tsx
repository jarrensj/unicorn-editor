import React, { useCallback, useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { Overlay } from "@/types/overlay";

type OverlayItemProps = {
  overlay: Overlay;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Overlay>) => void;
  onDelete: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
};

const OverlayItem = ({
  overlay,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  containerRef,
}: OverlayItemProps) => {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const resizeCorner = useRef<string>("");
  const startPos = useRef({ x: 0, y: 0 });
  const startOverlay = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const getContainerRect = useCallback(() => {
    return containerRef.current?.getBoundingClientRect() ?? null;
  }, [containerRef]);

  const pxToPercent = useCallback(
    (pxX: number, pxY: number) => {
      const rect = getContainerRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (pxX / rect.width) * 100,
        y: (pxY / rect.height) * 100,
      };
    },
    [getContainerRect]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect(overlay.id);
      isDragging.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
      };
    },
    [overlay, onSelect]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, corner: string) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect(overlay.id);
      isResizing.current = true;
      resizeCorner.current = corner;
      startPos.current = { x: e.clientX, y: e.clientY };
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
      };
    },
    [overlay, onSelect]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current && !isResizing.current) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      const delta = pxToPercent(deltaX, deltaY);

      if (isDragging.current) {
        const newX = Math.max(
          0,
          Math.min(100 - startOverlay.current.width, startOverlay.current.x + delta.x)
        );
        const newY = Math.max(
          0,
          Math.min(100 - startOverlay.current.height, startOverlay.current.y + delta.y)
        );
        onUpdate(overlay.id, { x: newX, y: newY });
      }

      if (isResizing.current) {
        const corner = resizeCorner.current;
        let newX = startOverlay.current.x;
        let newY = startOverlay.current.y;
        let newW = startOverlay.current.width;
        let newH = startOverlay.current.height;

        if (corner.includes("right")) {
          newW = Math.max(3, Math.min(100 - newX, startOverlay.current.width + delta.x));
        }
        if (corner.includes("left")) {
          const maxDelta = startOverlay.current.width - 3;
          const clampedDx = Math.max(-startOverlay.current.x, Math.min(maxDelta, delta.x));
          newX = startOverlay.current.x + clampedDx;
          newW = startOverlay.current.width - clampedDx;
        }
        if (corner.includes("bottom")) {
          newH = Math.max(3, Math.min(100 - newY, startOverlay.current.height + delta.y));
        }
        if (corner.includes("top")) {
          const maxDelta = startOverlay.current.height - 3;
          const clampedDy = Math.max(-startOverlay.current.y, Math.min(maxDelta, delta.y));
          newY = startOverlay.current.y + clampedDy;
          newH = startOverlay.current.height - clampedDy;
        }

        onUpdate(overlay.id, { x: newX, y: newY, width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [overlay.id, onUpdate, pxToPercent]);

  // Touch support
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current && !isResizing.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.current.x;
      const deltaY = touch.clientY - startPos.current.y;
      const delta = pxToPercent(deltaX, deltaY);

      if (isDragging.current) {
        const newX = Math.max(
          0,
          Math.min(100 - startOverlay.current.width, startOverlay.current.x + delta.x)
        );
        const newY = Math.max(
          0,
          Math.min(100 - startOverlay.current.height, startOverlay.current.y + delta.y)
        );
        onUpdate(overlay.id, { x: newX, y: newY });
      }

      if (isResizing.current) {
        const corner = resizeCorner.current;
        let newX = startOverlay.current.x;
        let newY = startOverlay.current.y;
        let newW = startOverlay.current.width;
        let newH = startOverlay.current.height;

        if (corner.includes("right")) {
          newW = Math.max(3, Math.min(100 - newX, startOverlay.current.width + delta.x));
        }
        if (corner.includes("left")) {
          const maxDelta = startOverlay.current.width - 3;
          const clampedDx = Math.max(-startOverlay.current.x, Math.min(maxDelta, delta.x));
          newX = startOverlay.current.x + clampedDx;
          newW = startOverlay.current.width - clampedDx;
        }
        if (corner.includes("bottom")) {
          newH = Math.max(3, Math.min(100 - newY, startOverlay.current.height + delta.y));
        }
        if (corner.includes("top")) {
          const maxDelta = startOverlay.current.height - 3;
          const clampedDy = Math.max(-startOverlay.current.y, Math.min(maxDelta, delta.y));
          newY = startOverlay.current.y + clampedDy;
          newH = startOverlay.current.height - clampedDy;
        }

        onUpdate(overlay.id, { x: newX, y: newY, width: newW, height: newH });
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [overlay.id, onUpdate, pxToPercent]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      onSelect(overlay.id);
      isDragging.current = true;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
      };
    },
    [overlay, onSelect]
  );

  const handleResizeTouchStart = useCallback(
    (e: React.TouchEvent, corner: string) => {
      e.stopPropagation();
      onSelect(overlay.id);
      isResizing.current = true;
      resizeCorner.current = corner;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
      };
    },
    [overlay, onSelect]
  );

  const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];

  const cornerStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: -4, left: -4, cursor: "nwse-resize" },
    "top-right": { top: -4, right: -4, cursor: "nesw-resize" },
    "bottom-left": { bottom: -4, left: -4, cursor: "nesw-resize" },
    "bottom-right": { bottom: -4, right: -4, cursor: "nwse-resize" },
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${overlay.x}%`,
        top: `${overlay.y}%`,
        width: `${overlay.width}%`,
        height: `${overlay.height}%`,
        zIndex: 20,
        cursor: "move",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "1px",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Overlay content */}
      {overlay.type === "square" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: overlay.color || "#000000",
            borderRadius: 2,
          }}
        />
      )}
      {overlay.type === "image" && overlay.imageUrl && (
        <img
          src={overlay.imageUrl}
          alt="Overlay"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Selection UI */}
      {isSelected && (
        <>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(overlay.id);
            }}
            style={{
              position: "absolute",
              top: -12,
              right: -12,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 30,
              padding: 0,
            }}
          >
            <X size={12} />
          </button>

          {/* Resize handles */}
          {corners.map((corner) => (
            <div
              key={corner}
              onMouseDown={(e) => handleResizeMouseDown(e, corner)}
              onTouchStart={(e) => handleResizeTouchStart(e, corner)}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                backgroundColor: "#3b82f6",
                border: "1px solid white",
                borderRadius: 1,
                zIndex: 25,
                ...cornerStyles[corner],
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default OverlayItem;
