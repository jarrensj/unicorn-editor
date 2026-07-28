import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, X } from "lucide-react"

export default function RoundImage() {
  const [image, setImage] = useState<string | null>(null)
  const [radius, setRadius] = useState(48)
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)
  const [previewScale, setPreviewScale] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const img = new Image()
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
        setImage(dataUrl)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setNaturalSize(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Largest radius that still fits the image (half of the shortest side)
  const maxRadius = naturalSize ? Math.floor(Math.min(naturalSize.width, naturalSize.height) / 2) : 500

  const downloadRounded = () => {
    if (!image || !naturalSize) return

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = naturalSize.width
      canvas.height = naturalSize.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const r = Math.min(radius, maxRadius)

      // Clip to a rounded rectangle, then draw the image
      ctx.beginPath()
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, canvas.width, canvas.height, r)
      } else {
        // Fallback rounded-rect path for older browsers
        ctx.moveTo(r, 0)
        ctx.lineTo(canvas.width - r, 0)
        ctx.arcTo(canvas.width, 0, canvas.width, r, r)
        ctx.lineTo(canvas.width, canvas.height - r)
        ctx.arcTo(canvas.width, canvas.height, canvas.width - r, canvas.height, r)
        ctx.lineTo(r, canvas.height)
        ctx.arcTo(0, canvas.height, 0, canvas.height - r, r)
        ctx.lineTo(0, r)
        ctx.arcTo(0, 0, r, 0, r)
      }
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(async (blob) => {
        if (!blob) return
        const fileName = "rounded-image.png"

        // iOS Safari ignores the anchor `download` attribute, so use the
        // Web Share API when available (gives a native "Save Image" sheet).
        const file = new File([blob], fileName, { type: "image/png" })
        const nav = navigator as Navigator & {
          canShare?: (data: { files: File[] }) => boolean
        }
        if (nav.canShare?.({ files: [file] }) && nav.share) {
          try {
            await nav.share({ files: [file], title: fileName })
            return
          } catch (err) {
            // User cancelled the share sheet — don't fall back to a download.
            if (err instanceof DOMException && err.name === "AbortError") return
            // Any other failure falls through to the anchor download below.
          }
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
      }, "image/png")
    }
    img.src = image
  }

  const effectiveRadius = Math.min(radius, maxRadius)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Round Image Corners</h1>
          <p className="text-muted-foreground">
            Upload an image, round its corners, and download it as a PNG
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Upload an image and adjust the corner radius</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Image</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {image ? "Change Image" : "Upload Image"}
                  </Button>
                  {image && (
                    <Button onClick={removeImage} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Corner Radius: {effectiveRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxRadius}
                  step="1"
                  value={effectiveRadius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  disabled={!image}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {image && (
                  <p className="text-xs text-muted-foreground">
                    Drag all the way right for a pill / circle shape
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Download</label>
                <Button
                  onClick={downloadRounded}
                  disabled={!image}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="flex items-center justify-center min-h-96">
            <CardContent className="flex items-center justify-center p-8 w-full">
              {image ? (
                <img
                  src={image}
                  alt="Preview with rounded corners"
                  onLoad={(e) => {
                    const el = e.currentTarget
                    if (el.naturalWidth) {
                      setPreviewScale(el.clientWidth / el.naturalWidth)
                    }
                  }}
                  style={{ borderRadius: effectiveRadius * previewScale }}
                  className="max-w-full max-h-[28rem] object-contain shadow-lg"
                />
              ) : (
                <p className="text-muted-foreground text-center">
                  Upload an image to round its corners
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
