import { useEffect, useState } from "react";

// The window's width in CSS px, kept current on resize/rotate.
// iPhones with Display Zoom ("Larger Text") report 320px instead of
// 375–430px, so fixed-size layouts must shrink to fit.
const useViewportWidth = () => {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return width;
};

export default useViewportWidth;
