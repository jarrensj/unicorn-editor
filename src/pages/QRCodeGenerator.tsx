import type React from "react"

import { useState } from "react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, X } from "lucide-react"

export default function QRCodeGenerator() {
  const [value, setValue] = useState("https://unicorneditor.com")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H")
  const [useTransparent, setUseTransparent] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
  }

  const downloadQRCode = (format: "png" | "svg" = "png") => {
    const svg = document.getElementById("qr-code") as SVGSVGElement
    if (!svg) return

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg)
      const link = document.createElement("a")
      const filename = "qr-code.svg"
      link.href = "data:image/svg+xml;base64," + btoa(svgData)
      link.download = filename
      link.click()
      return
    }

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    const scale = 2
    canvas.width = size * scale
    canvas.height = size * scale

    img.onload = () => {
      if (!useTransparent && ctx) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      if (ctx) {
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)
      }

      if (logo && ctx) {
        const logoImg = new Image()
        logoImg.crossOrigin = "anonymous"
        logoImg.onload = () => {
          const logoSize = size * 0.25
          const logoX = (size - logoSize) / 2
          const logoY = (size - logoSize) / 2
          ctx.fillStyle = "white"
          ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4)
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
          const link = document.createElement("a")
          const filename = useTransparent ? "qr-code-transparent.png" : "qr-code.png"
          link.href = canvas.toDataURL("image/png")
          link.download = filename
          link.click()
        }
        logoImg.src = logo
      } else {
        const link = document.createElement("a")
        const filename = useTransparent ? "qr-code-transparent.png" : "qr-code.png"
        link.href = canvas.toDataURL("image/png")
        link.download = filename
        link.click()
      }
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground">QR Code Generator</h1>
            <Badge variant="secondary" className="text-xs">WIP</Badge>
          </div>
          <p className="text-muted-foreground">Create custom QR codes for any URL or text</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Text or URL</label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter text or URL"
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Size: {size}px</label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">QR Code Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 bg-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${useTransparent ? "text-muted-foreground" : "text-foreground"}`}>
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    disabled={useTransparent}
                    className={`w-12 h-10 rounded ${useTransparent ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#FFFFFF"
                    disabled={useTransparent}
                    className="flex-1 bg-input"
                  />
                </div>
                {useTransparent && (
                  <p className="text-xs text-muted-foreground">Background color is disabled in transparent mode</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Error Correction</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["L", "M", "Q", "H"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                        level === l
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Higher levels tolerate more damage</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Background</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseTransparent(false)}
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      !useTransparent
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => setUseTransparent(true)}
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      useTransparent
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Transparent
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Logo (Optional)</label>
                <div className="flex gap-2">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="flex-1 text-sm" />
                  {logo && (
                    <Button onClick={removeLogo} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {logo && (
                  <div className="text-xs text-muted-foreground">Logo uploaded and will be placed in center</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Download Format</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadQRCode("png")}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PNG
                  </Button>
                  <Button
                    onClick={() => downloadQRCode("svg")}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    SVG
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="flex items-center justify-center min-h-96">
            <CardContent className="flex items-center justify-center p-8">
              {value ? (
                <div className={`relative p-6 rounded-lg shadow-lg ${useTransparent ? "bg-transparent" : "bg-white"}`}>
                  <QRCode
                    id="qr-code"
                    value={value}
                    size={size}
                    bgColor={useTransparent ? "rgba(0,0,0,0)" : bgColor}
                    fgColor={fgColor}
                    level={level}
                    includeMargin={true}
                  />
                  {logo && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                      <div className="bg-white rounded p-1">
                        <img
                          src={logo || "/placeholder.svg"}
                          alt="Logo preview"
                          style={{ width: size * 0.25, height: size * 0.25 }}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">Enter text or URL to generate QR code</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
