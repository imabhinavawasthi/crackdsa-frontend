import { useEffect } from "react";

export interface KeyPressOptions {
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

/**
 * Hook to execute a handler when a specific key is pressed.
 */
export function useKeyPress(
  targetKey: string,
  handler: (event: KeyboardEvent) => void,
  options?: KeyPressOptions
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        if (
          (options?.ctrlKey !== undefined && event.ctrlKey !== options.ctrlKey) ||
          (options?.metaKey !== undefined && event.metaKey !== options.metaKey) ||
          (options?.shiftKey !== undefined && event.shiftKey !== options.shiftKey) ||
          (options?.altKey !== undefined && event.altKey !== options.altKey)
        ) {
          // If a modifier is specified and doesn't match, we don't trigger
          // Wait, for metaKey or ctrlKey, usually we want either one for Mac/Windows compatibility.
          // Let's handle 'ctrlOrMeta' optionally? Actually, if options is just exact match, it's fine.
          // For now, let's keep it simple. If we want either ctrl or meta, maybe we can just check if ANY of them are true if we just pass a combined flag.
          // Actually, let's just let the caller handle it if it's complex, but for `useKeyPress` we can support it.
          // Let's revert and do exact match.
        }
        
        // Let's implement this cleanly.
        const isCtrlMetaMatch = options?.ctrlKey || options?.metaKey
          ? (event.ctrlKey || event.metaKey)
          : !(event.ctrlKey || event.metaKey);
        const isShiftMatch = options?.shiftKey ? event.shiftKey : !event.shiftKey;
        const isAltMatch = options?.altKey ? event.altKey : !event.altKey;

        if (
          (!options && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) ||
          (options && isCtrlMetaMatch && isShiftMatch && isAltMatch)
        ) {
          handler(event);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetKey, handler, options]);
}
