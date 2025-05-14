
import { useState, useEffect, RefObject } from "react";

export const useMousePosition = (ref: RefObject<HTMLElement>) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      // Get element dimensions and position
      const rect = ref.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the element
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [ref]);

  // For accessibility and mobile devices
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) {
      // For devices without hover capabilities (like mobile)
      const autoAnimate = () => {
        const time = Date.now() * 0.001;
        setMousePosition({
          x: Math.sin(time) * 10,
          y: Math.cos(time) * 10
        });
      };
      
      const interval = setInterval(autoAnimate, 50);
      return () => clearInterval(interval);
    }
  }, []);

  return mousePosition;
};
