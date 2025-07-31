
import { useRef, useState, useEffect } from "react";

export const useScrollIndicator = (timeoutMs = 5000) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Show/hide scroll indicator based on content and scrolling behavior
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    
    if (!scrollArea) return;
    
    // Find the actual scrollable viewport element (Radix UI ScrollArea structure)
    // The viewport is the child div with classes "h-full w-full rounded-[inherit]"
    let viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (!viewport) {
      // Fallback to the viewport with the specific classes from our ScrollArea component
      viewport = scrollArea.querySelector('div.h-full.w-full') as HTMLElement;
    }
    
    const scrollableElement = viewport || scrollArea;
    
    // Check if content is scrollable
    const checkScrollable = () => {
      const isScrollable = scrollableElement.scrollHeight > scrollableElement.clientHeight;
      
      if (isScrollable && scrollableElement.scrollTop === 0) {
        // Only show if there's content to scroll and we're at the top
        setShowScrollIndicator(true);
        
        // Hide indicator after specified timeout
        const timer = setTimeout(() => {
          setShowScrollIndicator(false);
        }, timeoutMs);
        
        return timer;
      } else {
        setShowScrollIndicator(false);
        return null;
      }
    };
    
    // Initial check - delay slightly to ensure content is rendered
    const initialTimer = setTimeout(() => {
      checkScrollable();
    }, 300);
    
    // Hide indicator on scroll
    const handleScroll = () => {
      setShowScrollIndicator(false);
    };
    
    // Re-check when content changes (using ResizeObserver)
    const resizeObserver = new ResizeObserver(() => {
      // Re-check scrollability after content changes
      setTimeout(() => {
        checkScrollable();
      }, 100);
    });
    
    // Observe the scrollable element for content changes
    resizeObserver.observe(scrollableElement);
    
    // Listen for scroll events on the actual scrollable element
    scrollableElement.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(initialTimer);
      scrollableElement.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [timeoutMs]);

  return { showScrollIndicator, scrollAreaRef };
};
