import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import ImageEditor from "@/components/ImageEditor";
import Footer from "@/components/Footer";

const Index = () => {
  // Add smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // State to track if an image is uploaded
  const [hasImage, setHasImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Check sessionStorage on component mount - align with ImageUploader check
  useEffect(() => {
    // Clear session storage on fresh page load
    sessionStorage.removeItem('imageUploaded');
    sessionStorage.removeItem('image');
    setHasImage(false);
    setImageUrl(null);
  }, []);
  
  const handleImageUpload = (imageDataUrl: string) => {
    setImageUrl(imageDataUrl);
    setHasImage(true);
    sessionStorage.setItem('imageUploaded', 'true');
    sessionStorage.setItem('image', imageDataUrl);
    
    // Scroll to editor section after a short delay to ensure it's rendered
    setTimeout(() => {
      const editorSection = document.getElementById('editor');
      if (editorSection) {
        editorSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <ParticleBackground />
      
      <main>
        <HeroSection onImageUploaded={handleImageUpload} />
        {hasImage && <ImageEditor initialImageUrl={imageUrl} />}
      </main>
      
      <Footer />

      {/* Keep the floating decorative elements with animations */}
      <motion.div
        className="fixed w-12 h-12 rounded-full bg-unicorn-purpleLight blur-xl opacity-70 float-slow"
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
        className="fixed w-10 h-10 rounded-full bg-unicorn-pink blur-xl opacity-70 float"
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
        className="fixed w-14 h-14 rounded-full bg-unicorn-skyBlue blur-xl opacity-70 float-fast"
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
      
      {/* Additional decorative elements with enhanced animations */}
      <motion.div
        className="fixed w-8 h-8 rounded-full bg-unicorn-magenta blur-xl opacity-60 float"
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
        className="fixed w-10 h-10 rounded-full bg-unicorn-blue blur-xl opacity-50 float-slow"
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
  );
};

export default Index;
