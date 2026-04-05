import { useState, useRef, useCallback } from "react";
import LoaderSpinner from "./LoaderSpinner";
import styles from "./styles/PullToRefresh.module.scss";

const TRIGGER_THRESHOLD = 80; // px of pull needed to fire refresh
const INDICATOR_HEIGHT = 60;  // px the indicator sits at while loading
const MAX_PULL = 110;         // resistance cap so it doesn't pull forever

/**
 * Wrap any page with <PullToRefresh onRefresh={asyncFn}> to get a native-
 * feeling pull-to-refresh. onRefresh should return a Promise (or be async).
 * The indicator snaps closed automatically once the Promise resolves.
 */
const PullToRefresh = ({ onRefresh, children }) => {
  const [pullHeight, setPullHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [animated, setAnimated] = useState(false);

  const startY = useRef(null);
  const isPulling = useRef(false);
  const latestPull = useRef(0); // ref copy of pullHeight accessible in async

  const onTouchStart = useCallback((e) => {
    // Only begin tracking when the page is already scrolled to the very top
    if (window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
    setAnimated(false); // no easing during the active drag
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      if (startY.current === null || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        // Upward move — let normal scroll take over
        startY.current = null;
        return;
      }
      isPulling.current = true;
      const h = Math.min(delta * 0.45, MAX_PULL); // apply rubber-band resistance
      latestPull.current = h;
      setPullHeight(h);
    },
    [refreshing]
  );

  const onTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    startY.current = null;
    setAnimated(true); // re-enable easing for snap-back / lock-in

    const triggered = latestPull.current >= TRIGGER_THRESHOLD;
    latestPull.current = 0;

    if (triggered) {
      setRefreshing(true);
      setPullHeight(INDICATOR_HEIGHT); // lock indicator open while loading
      try {
        await Promise.resolve(onRefresh());
      } catch {}
      setRefreshing(false);
    }
    // Animate back to 0 (with easing since animated=true above)
    setPullHeight(0);
  }, [onRefresh]);

  const transition = animated
    ? "height 0.3s ease, transform 0.3s ease"
    : "none";

  return (
    <div
      className={styles.wrapper}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Spinner indicator slides down from the top */}
      <div
        className={styles.indicator}
        style={{ height: pullHeight, transition }}
      >
        {(pullHeight > 16 || refreshing) && (
          <LoaderSpinner width="2.6rem" height="2.6rem" color="#5BABF2" />
        )}
      </div>

      {/* Page content shifts down to make room for the indicator.
          Only apply the transform when actually pulling — a translateY(0)
          still creates a stacking context that can interfere with scroll. */}
      <div
        style={
          pullHeight > 0
            ? { transform: `translateY(${pullHeight}px)`, transition }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
