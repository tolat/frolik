import { useEffect, useRef, useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import styles from "./styles/PullToRefresh.module.scss";

const MAX_PULL = 120; // px — the pull eases toward this, never past it
const TRIGGER = 72; // px of (eased) pull needed to refresh
const HOLD = 56; // px the content rests at while refreshing
const SNAP_MS = 380;
const MAX_WAIT_MS = 8000; // never leave the spinner up forever
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Rubber-band curve: 1:1 at first, smoothly approaching MAX_PULL
const rubber = (d) => MAX_PULL * (1 - Math.exp(-d / MAX_PULL));

/**
 * Wrap a page with <PullToRefresh onRefresh={asyncFn}> for native-feeling
 * pull-to-refresh. onRefresh should return a Promise.
 *
 * The drag is applied straight to the DOM (GPU transform, once per animation
 * frame) instead of through React state, so the page doesn't re-render on
 * every touchmove — that re-rendering is what made the old version jerky.
 */
const PullToRefresh = ({ onRefresh, children }) => {
  const contentRef = useRef(null);
  const indicatorRef = useRef(null);
  const wrapperRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const s = useRef({ startY: null, pulling: false, pull: 0, latest: 0, raf: 0, busy: false });
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const indicator = indicatorRef.current;
    if (!wrapper || !content || !indicator) return;
    const state = s.current;

    const apply = (h, animate) => {
      const t = animate ? `transform ${SNAP_MS}ms ${EASE}` : "none";
      content.style.transition = t;
      indicator.style.transition = animate
        ? `${t}, opacity ${SNAP_MS}ms ease`
        : "none";
      content.style.transform = h > 0 ? `translate3d(0, ${h}px, 0)` : "";
      // Fully visible while refreshing; otherwise grows with the pull
      const progress = state.busy && h > 0 ? 1 : Math.min(h / TRIGGER, 1);
      indicator.style.opacity = String(progress);
      indicator.style.transform = `translate3d(-50%, ${h / 2 - 20}px, 0) scale(${
        0.6 + 0.4 * progress
      })`;
      state.pull = h;
    };

    const atTop = () =>
      (document.scrollingElement || document.documentElement).scrollTop <= 0;

    const onStart = (e) => {
      if (state.busy || !atTop()) return;
      state.startY = e.touches[0].clientY;
      state.startX = e.touches[0].clientX;
      state.pulling = false;
      state.latest = 0;
    };

    const onMove = (e) => {
      if (state.startY === null || state.busy) return;
      const delta = e.touches[0].clientY - state.startY;
      // Mostly-sideways gesture (e.g. swiping a chat card): not a pull
      if (!state.pulling) {
        const dx = Math.abs(e.touches[0].clientX - state.startX);
        if (dx > 8 && dx > Math.abs(delta)) {
          state.startY = null;
          return;
        }
      }
      if (delta <= 0) {
        if (state.pulling) apply(0, false);
        else state.startY = null; // scrolling up normally
        return;
      }
      // No preventDefault: a non-passive touchmove listener makes the browser
      // wait on JS before every scroll frame (that was the scroll lag). The
      // native bounce is already disabled with overscroll-behavior in CSS.
      state.pulling = true;
      const h = rubber(delta);
      state.latest = h; // read on release even if this frame never painted
      cancelAnimationFrame(state.raf);
      state.raf = requestAnimationFrame(() => apply(h, false));
    };

    const onEnd = async () => {
      state.startY = null;
      if (!state.pulling) return;
      state.pulling = false;
      cancelAnimationFrame(state.raf);

      if (state.latest >= TRIGGER) {
        state.busy = true;
        setRefreshing(true);
        apply(HOLD, true);
        try {
          await Promise.race([
            Promise.resolve(onRefreshRef.current?.()),
            new Promise((r) => setTimeout(r, MAX_WAIT_MS)),
          ]);
        } catch {}
        setRefreshing(false);
        state.busy = false;
      }
      apply(0, true);
    };

    // Clear the transform once the snap-back finishes (a lingering transform
    // breaks position: fixed elements inside the page)
    const onTransitionEnd = () => {
      if (state.pull === 0) content.style.transform = "";
    };

    wrapper.addEventListener("touchstart", onStart, { passive: true });
    wrapper.addEventListener("touchmove", onMove, { passive: true });
    wrapper.addEventListener("touchend", onEnd);
    wrapper.addEventListener("touchcancel", onEnd);
    content.addEventListener("transitionend", onTransitionEnd);
    apply(0, false);

    return () => {
      cancelAnimationFrame(state.raf);
      wrapper.removeEventListener("touchstart", onStart);
      wrapper.removeEventListener("touchmove", onMove);
      wrapper.removeEventListener("touchend", onEnd);
      wrapper.removeEventListener("touchcancel", onEnd);
      content.removeEventListener("transitionend", onTransitionEnd);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={indicatorRef} className={styles.indicator} aria-hidden={!refreshing}>
        <LoaderSpinner width="2.4rem" height="2.4rem" color="#5b8def" />
      </div>
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
