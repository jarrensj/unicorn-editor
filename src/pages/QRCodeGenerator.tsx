import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, X } from "lucide-react"
import ParticleBackground from "@/components/ParticleBackground"
import Footer from "@/components/Footer"

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
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen p-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">QR Code Generator</h1>
              <Badge variant="secondary" className="text-xs">WIP</Badge>
            </div>
            <p className="text-muted-foreground text-lg">Create custom QR codes for any URL or text</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm bg-white/90">
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
          </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="flex items-center justify-center min-h-96 backdrop-blur-sm bg-white/90">
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
          </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Floating decorative elements with animations - matching home page */}
      <motion.div
        className="fixed w-12 h-12 rounded-full bg-unicorn-purpleLight blur-xl opacity-70 float-slow pointer-events-none"
        animate={{
          x: [0, 100, 50, 150, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ left: "10%", top: "20%" }}
      />
      
      <motion.div
        className="fixed w-10 h-10 rounded-full bg-unicorn-pink blur-xl opacity-70 float pointer-events-none"
        animate={{
          x: [0, -70, -140, -70, 0],
          y: [0, 100, 50, 150, 0],
          scale: [1, 0.8, 1.2, 0.9, 1],
          rotate: [0, -90, -180, -270, -360]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ right: "15%", top: "15%" }}
      />
      
      <motion.div
        className="fixed w-14 h-14 rounded-full bg-unicorn-skyBlue blur-xl opacity-70 float-fast pointer-events-none"
        animate={{
          x: [0, 80, 40, 120, 0],
          y: [0, -80, -40, -120, 0],
          scale: [1, 1.1, 0.9, 1.2, 1],
          rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ right: "25%", bottom: "20%" }}
      />
      
      <motion.div
        className="fixed w-8 h-8 rounded-full bg-unicorn-magenta blur-xl opacity-60 float pointer-events-none"
        animate={{
          x: [0, -50, -100, -50, 0],
          y: [0, -30, -60, -30, 0],
          scale: [1, 1.3, 1, 0.7, 1],
          filter: ["blur(12px)", "blur(18px)", "blur(12px)", "blur(8px)", "blur(12px)"]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ left: "20%", bottom: "25%" }}
      />
      
      <motion.div
        className="fixed w-10 h-10 rounded-full bg-unicorn-blue blur-xl opacity-50 float-slow pointer-events-none"
        animate={{
          x: [0, 120, 60, 180, 0],
          y: [0, 70, 140, 70, 0],
          scale: [1, 0.9, 1.1, 0.8, 1],
          filter: ["blur(10px)", "blur(15px)", "blur(10px)", "blur(5px)", "blur(10%)"]
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ right: "40%", top: "40%" }}
      />

      {/* Star-shaped particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-unicorn-purple opacity-20 pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 1 + 0.5}rem`
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  )
}
