import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../../utils/scrollLock";
import styles from "./styles/Drawer.module.scss";

const CLOSE_MS = 280; // a little longer than the 0.24s slide-down

// Bottom drawer used by every popup (WarningPopup via Popup, EmptyPopup):
// a white sheet that slides up from the bottom of the screen over a dimmed
// backdrop, with a grab handle. Tap outside or drag the handle down to close
// (calls onClose). Same motion as the activity and crop drawers.
//
// Props: open, onClose, label (for screen readers), children.
const Drawer = ({ open: isOpen, onClose, label, children }) => {
  useScrollLock(!!isOpen);
  const sheetRef = useRef(null);

  // Stay mounted while sliding out; add "open" a frame after mounting so the
  // slide-in runs. Keep the last content while it slides away.
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const lastChildren = useRef(children);
  if (isOpen) lastChildren.current = children;

  useEffect(() => {
    if (isOpen) {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "";
        sheetRef.current.style.transition = "";
      }
      setShown(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setOpen(true))
      );
      return () => cancelAnimationFrame(raf);
    }
    setOpen(false);
    const t = setTimeout(() => setShown(false), CLOSE_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Drag the handle down to dismiss (follows the finger once per frame;
  // data-dragging switches the slide transition off, see index.css)
  const drag = useRef(null);
  const onHandleDown = (e) => {
    drag.current = { y: e.clientY, dy: 0, raf: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    sheetRef.current?.setAttribute("data-dragging", "true");
  };
  const onHandleMove = (e) => {
    const d = drag.current;
    if (!d || !sheetRef.current) return;
    d.dy = Math.max(0, e.clientY - d.y);
    if (d.raf) return;
    d.raf = requestAnimationFrame(() => {
      d.raf = 0;
      if (sheetRef.current)
        sheetRef.current.style.transform = `translate3d(0, ${d.dy}px, 0)`;
    });
  };
  const onHandleUp = () => {
    if (!drag.current || !sheetRef.current) return;
    const { dy, raf } = drag.current;
    if (raf) cancelAnimationFrame(raf);
    drag.current = null;
    sheetRef.current.removeAttribute("data-dragging");
    sheetRef.current.style.transition = "";
    if (dy > 60) {
      sheetRef.current.style.transform = "translateY(100%)";
      onClose && onClose();
    } else {
      sheetRef.current.style.transform = "";
    }
  };

  if (!shown && !isOpen) return null;

  return createPortal(
    // data-instant: skip the Reduce Motion popup fade — the sheet slides
    <div
      className={`${styles.root} ${open ? styles.open : ""}`}
      data-instant="true"
    >
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={sheetRef}
        className={styles.sheet}
        data-drawer-sheet="true"
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div
          className={styles.handleArea}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
        >
          <div className={styles.handle} />
        </div>
        <div className={styles.content}>
          {isOpen ? children : lastChildren.current}
        </div>
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default Drawer;
