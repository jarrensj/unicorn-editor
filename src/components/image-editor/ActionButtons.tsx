import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, Share2 } from "lucide-react";
import { handleImageAction } from "@/utils/image/processor";
import { useIsMobile } from "@/hooks/use-mobile";
import { createCanvas, drawBackgroundImage, drawMainImage, drawBackground, drawOverlays } from "@/utils/image/processor/canvas";
import type { Overlay } from "@/types/overlay";

export type ActionButtonsComponentProps = {
  imageUrl: string | null;
  onDownload: () => void;
  selectedBackground: string;
  backgroundImage: string | null;
  imageScale: number;
  imageCornerRadius: number;
  frameCornerRadius: number;
  canvasWidth: number;
  canvasHeight: number;
  overlays: Overlay[];
};

const ActionButtons: React.FC<ActionButtonsComponentProps> = ({
  imageUrl,
  onDownload,
  selectedBackground,
  backgroundImage,
  imageScale,
  imageCornerRadius,
  frameCornerRadius,
  canvasWidth,
  canvasHeight,
  overlays,
}: ActionButtonsComponentProps) => {
  const isMobile = useIsMobile();

  const applyFrameCornerRadius = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    if (frameCornerRadius <= 0) return canvas;

    const roundedCanvas = document.createElement("canvas");
    const roundedCtx = roundedCanvas.getContext("2d");

    if (!roundedCtx) return canvas;

    roundedCanvas.width = canvas.width;
    roundedCanvas.height = canvas.height;

    roundedCtx.beginPath();
    roundedCtx.roundRect(0, 0, canvas.width, canvas.height, frameCornerRadius);
    roundedCtx.clip();
    roundedCtx.drawImage(canvas, 0, 0);

    return roundedCanvas;
  };

  const handleCopyToClipboard = () => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const { canvas, ctx } = createCanvas(img, true, { width: canvasWidth, height: canvasHeight });

      // Process the image with background
      if (backgroundImage) {
        const bgImg = new Image();
        bgImg.onload = async () => {
          drawBackgroundImage(ctx, bgImg, canvas);
          drawMainImage(ctx, img, canvas, imageScale, imageCornerRadius);
          await drawOverlays(ctx, canvas, overlays);
          handleImageAction(applyFrameCornerRadius(canvas));
        };
        bgImg.src = backgroundImage;
      } else {
        drawBackground(ctx, canvas, selectedBackground);
        drawMainImage(ctx, img, canvas, imageScale, imageCornerRadius);
        drawOverlays(ctx, canvas, overlays).then(() => {
          handleImageAction(applyFrameCornerRadius(canvas));
        });
      }
    };
    img.src = imageUrl;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      <Button
        onClick={onDownload}
        className="unicorn-button sparkle-cursor py-2 flex-1"
        disabled={!imageUrl}
      >
        <Download className="h-4 w-4 mr-2" />
        {isMobile ? "Save to Device" : "Download Image"}
      </Button>

      <Button
        onClick={handleCopyToClipboard}
        variant="outline"
        className="py-2 flex items-center justify-center gap-2"
        disabled={!imageUrl}
      >
        {isMobile ? (
          <>
            <Share2 className="h-4 w-4" />
            Share Image
          </>
        ) : (
          <>
            <Clipboard className="h-4 w-4" />
            Copy to Clipboard
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
