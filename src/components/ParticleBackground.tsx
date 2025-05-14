
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  growing: boolean;
  layer: number; // Added layer property for parallax effect
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Particle[] = [];
    let scrollY = window.scrollY;
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Handle scroll events for parallax effect
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      const scrollDelta = newScrollY - scrollY;
      scrollY = newScrollY;
      
      // Update particle positions based on scroll
      particles.forEach(particle => {
        // Different layers move at different speeds
        particle.y -= scrollDelta * (0.1 + particle.layer * 0.15);
        
        // Wrap particles around screen
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
      });
    };
    
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll);
    resizeCanvas();
    
    // Create particles with layers
    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 8); // More particles
      
      const colors = [
        "#9b87f5", "#D6BCFA", "#FFDEE2", "#D946EF", "#D3E4FD", "#33C3F0", "#ffffff",
        "#F9A8D4", "#A78BFA", "#93C5FD"
      ];
      
      for (let i = 0; i < particleCount; i++) {
        const layer = Math.floor(Math.random() * 3); // 3 different layers
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (3 - layer) + 1, // Smaller particles in back layers
          speedX: (Math.random() * 0.4 - 0.2) * (layer + 1), // Faster movement in front layers
          speedY: (Math.random() * 0.4 - 0.2) * (layer + 1),
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2, // Varying opacity
          growing: Math.random() > 0.5,
          layer: layer
        });
      }
    };
    
    createParticles();
    
    // Animation loop with enhanced parallax effects
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        // Update position with layer-based speeds
        particle.x += particle.speedX * (particle.layer + 1);
        particle.y += particle.speedY * (particle.layer + 1);
        
        // Pulsating size effect
        if (particle.growing) {
          particle.size += 0.02;
          if (particle.size > 3) {
            particle.growing = false;
          }
        } else {
          particle.size -= 0.02;
          if (particle.size < 1) {
            particle.growing = true;
          }
        }
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle with glow effect based on layer
        ctx.save();
        ctx.globalAlpha = particle.alpha * (0.5 + particle.layer * 0.25);
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the core of the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        ctx.restore();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
