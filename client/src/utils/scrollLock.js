import { useEffect } from "react";

// Counted page scroll lock for popups (photo viewer etc.). Uses a class on
// <html> so it never clobbers the inline overflow the slide-in panels set.
let locks = 0;

const apply = () =>
  document.documentElement.classList.toggle("scroll-locked", locks > 0);

export const lockScroll = () => {
  locks += 1;
  apply();
};

export const unlockScroll = () => {
  locks = Math.max(0, locks - 1);
  apply();
};

// Lock the page behind a popup while `active` is true
export const useScrollLock = (active) => {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return unlockScroll;
  }, [active]);
};
