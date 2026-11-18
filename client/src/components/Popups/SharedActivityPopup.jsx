import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import ActivityCard from "../UI/ActivityCard";
import { popupActions } from "../../store/popup-slice";
import { useScrollLock } from "../../utils/scrollLock";
import styles from "./styles/ActivityDrawer.module.scss";
import { useT } from "../../i18n";

const CLOSE_MS = 280; // a little longer than the 0.24s slide-down

// The activity opened from the Social / Profile feed or a chat message: a
// full-width drawer that slides up from the bottom of the screen, at most 80%
// of the screen tall; its content scrolls when longer. Tap outside, or drag
// the handle down, to close.
const SharedActivityPopup = () => {
  const dispatch = useDispatch();
  const { t } = useT();
  const activity = useSelector((state) => state.popup.sharedActivity);
  const isOpen = useSelector(
    (state) => state.popup.selector === "shared-activity"
  );
  useScrollLock(isOpen);
  const sheetRef = useRef(null);

  // Stay mounted while sliding out; add the "open" class one frame after
  // mounting so the slide-in runs
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Clear any inline position left by a drag-to-close
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
    const timer = setTimeout(() => setShown(false), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const close = () => dispatch(popupActions.hidePopup());

  // Drag the handle down to dismiss
  const drag = useRef(null);
  // While dragging, the sheet follows the finger 1:1 — `data-dragging`
  // switches its slide transition off (an inline "transition: none" lost to the
  // Reduce Motion !important rule, so every move animated and the sheet
  // shook and trailed the finger) — and moves at most once per frame.
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
    if (dy > 80) {
      // Carry on down from where it was let go
      sheetRef.current.style.transform = "translateY(100%)";
      close();
    } else {
      sheetRef.current.style.transform = ""; // spring back up
    }
  };

  if (!shown && !isOpen) return null;

  return createPortal(
    // data-instant: skip the Reduce Motion popup fade — the sheet rolls up
    <div
      className={`${styles.root} ${open ? styles.open : ""}`}
      data-instant="true"
    >
      <div className={styles.backdrop} onClick={close} />
      <div
        ref={sheetRef}
        className={styles.sheet}
        data-drawer-sheet="true"
        role="dialog"
        aria-modal="true"
        aria-label={activity?.name || t("popups.sharedActivity.label")}
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
        <div className={styles.scrollArea}>
          {activity ? (
            <ActivityCard
              key={activity._id}
              showInstructions={true}
              activity={activity}
              hideSelect={true}
              socialActions={true}
              drawer={true}
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default SharedActivityPopup;
