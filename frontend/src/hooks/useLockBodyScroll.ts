import { useEffect } from "react";

/* Module-level ref counter so nested/stacked locks don't fight. */
let lockCount = 0;
let savedScrollY = 0;
let savedStyles: {
  overflow: string;
  position: string;
  top: string;
  width: string;
  paddingRight: string;
} | null = null;

function applyLock() {
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    savedStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
    };

    // Compensate for scrollbar width to avoid layout shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount += 1;
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && savedStyles) {
    document.body.style.overflow = savedStyles.overflow;
    document.body.style.position = savedStyles.position;
    document.body.style.top = savedStyles.top;
    document.body.style.width = savedStyles.width;
    document.body.style.paddingRight = savedStyles.paddingRight;
    window.scrollTo(0, savedScrollY);
    savedStyles = null;
  }
}

/**
 * Locks body scroll while `locked` is true.
 * Safe to call from multiple components simultaneously — the body
 * is only released when the LAST lock is released.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    applyLock();
    return () => releaseLock();
  }, [locked]);
}