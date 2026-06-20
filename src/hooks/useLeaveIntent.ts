import { useEffect, useRef } from "react";

/**
 * Hook to detect when a user intends to leave the page 
 * (e.g. mouse cursor goes above the viewport).
 * Also registers a beforeunload listener.
 */
export function useLeaveIntent(
  onLeaveIntent: () => void,
  options = { threshold: 20 }
) {
  const triggered = useRef(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < options.threshold && !triggered.current) {
        triggered.current = true;
        onLeaveIntent();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onLeaveIntent, options.threshold]);

  return {
    resetTrigger: () => {
      triggered.current = false;
    }
  };
}
