import { useState, useEffect } from "react";

/**
 * Hook to track the window's vertical scroll position.
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Set initial position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}
