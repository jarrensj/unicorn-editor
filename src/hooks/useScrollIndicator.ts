
import { useRef, useState, useEffect } from "react";

export const useScrollIndicator = (timeoutMs = 5000) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Hide scroll indicator after scrolling or after a few seconds
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    
    // Hide indicator after specified timeout
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, timeoutMs);
    
    // Hide indicator on scroll
    const handleScroll = () => {
      setShowScrollIndicator(false);
    };
    
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      clearTimeout(timer);
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [timeoutMs]);

  return { showScrollIndicator, scrollAreaRef };
};
