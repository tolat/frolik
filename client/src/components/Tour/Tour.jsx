import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { scrollToElement } from "../../utils/scrollTo";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import steps from "./tourSteps";
import styles from "./Tour.module.scss";
import { markTourSeen } from "../../utils/data-fetch";

// Start the tour from anywhere (e.g. the Settings screen)
export const startTour = () =>
  window.dispatchEvent(new Event("frolik:start-tour"));

const PAD = 8; // spotlight padding around the target, px
const GAP = 14; // space between spotlight and card, px
const EDGE = 12; // min distance from viewport edges, px
const MAIN_PAGES = ["/profile", "/outing", "/social", "/chat", "/alerts"];

// fitChildren: hug the element's children instead of the element itself
// (for containers that stretch wider than their visible content)
const measure = (el, fitChildren) => {
  let r = el.getBoundingClientRect();
  if (fitChildren && el.children.length) {
    const rs = [...el.children].map((c) => c.getBoundingClientRect());
    const left = Math.min(...rs.map((x) => x.left));
    const top = Math.min(...rs.map((x) => x.top));
    r = {
      left,
      top,
      width: Math.max(...rs.map((x) => x.right)) - left,
      height: Math.max(...rs.map((x) => x.bottom)) - top,
    };
  }
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
};

const Tour = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [index, setIndex] = useState(null); // null = tour closed
  const [rect, setRect] = useState(null); // spotlight rect, null = centered
  const [ready, setReady] = useState(false);
  const [cardPos, setCardPos] = useState(null);
  const autoStarted = useRef(false);
  const cardRef = useRef(null);
  const nextRef = useRef(null);
  const targetRef = useRef(null);
  const step = index !== null ? steps[index] : null;
  const isLast = index === steps.length - 1;

  // Auto-start once for accounts that haven't seen the tour
  useEffect(() => {
    if (!user?._id || user.tour_seen || autoStarted.current) return;
    if (!MAIN_PAGES.includes(location.pathname)) return;
    const t = setTimeout(() => {
      autoStarted.current = true;
      setIndex(0);
    }, 900);
    return () => clearTimeout(t);
  }, [user?._id, user?.tour_seen, location.pathname]);

  // Manual start (Settings → "Take the app tour")
  useEffect(() => {
    const start = () => {
      autoStarted.current = true;
      setIndex(0);
    };
    window.addEventListener("frolik:start-tour", start);
    return () => window.removeEventListener("frolik:start-tour", start);
  }, []);

  // For each step: switch page if needed, then find + spotlight the target
  useEffect(() => {
    if (!step) return;
    setReady(false);
    setRect(null);
    targetRef.current = null;

    if (step.route && location.pathname !== step.route) {
      navigate(step.route); // this effect re-runs once the page changes
      return;
    }
    if (!step.target) {
      setReady(true);
      return;
    }

    let cancelled = false;
    let tries = 0;
    const find = () => {
      if (cancelled) return;
      const el = document.querySelector(step.target);
      if (el && el.getBoundingClientRect().height > 0) {
        targetRef.current = el;
        scrollToElement(el, { block: "center", behavior: "auto" });
        requestAnimationFrame(() => {
          if (cancelled) return;
          setRect(measure(el, step.fitChildren));
          setReady(true);
        });
      } else if (tries++ < 40) {
        setTimeout(find, 100); // page content may still be loading
      } else {
        setReady(true); // target never appeared: show the step centered
      }
    };
    find();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, location.pathname]);

  // Keep the spotlight on the target if the page scrolls or resizes
  useEffect(() => {
    if (index === null) return;
    const update = () => {
      if (targetRef.current)
        setRect(measure(targetRef.current, steps[index]?.fitChildren));
      else setCardPos(null);
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [index]);

  // Place the card below the spotlight, or above it if there's no room
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !ready) return;
    if (!rect) {
      setCardPos(null);
      return;
    }
    const { offsetWidth: w, offsetHeight: h } = card;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top;
    if (rect.top + rect.height + GAP + h <= vh - EDGE) {
      top = rect.top + rect.height + GAP;
    } else if (rect.top - GAP - h >= EDGE) {
      top = rect.top - GAP - h;
    } else {
      top = Math.max(EDGE, vh - h - EDGE); // tall target: pin to bottom
    }
    const left = Math.min(
      Math.max(EDGE, rect.left + rect.width / 2 - w / 2),
      vw - w - EDGE
    );
    setCardPos({ top, left });
  }, [rect, ready, index]);

  // Focus the primary button for keyboard users
  useEffect(() => {
    if (ready) nextRef.current?.focus({ preventScroll: true });
  }, [ready, index]);

  const finish = () => {
    // Finishing (not skipping) can send the user somewhere, e.g. back home
    if (step?.finishRoute && isLast) navigate(step.finishRoute);
    setIndex(null);
    setRect(null);
    targetRef.current = null;
    if (user) markTourSeen(user);
  };
  const next = () => (isLast ? finish() : setIndex((i) => i + 1));
  const back = () => setIndex((i) => Math.max(0, i - 1));

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!step) return null;

  return createPortal(
    <div className={styles.overlay} aria-hidden={false}>
      {/* Dims everything except the spotlight hole */}
      <div
        className={`${styles.spotlight} ${rect ? "" : styles.noTarget}`}
        style={rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : undefined}
      />
      <div
        key={index}
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        className={`${styles.card} ${ready ? styles.cardVisible : ""} ${
          cardPos ? "" : styles.cardCentered
        }`}
        style={cardPos ? { top: cardPos.top, left: cardPos.left } : undefined}
      >
        <div className={styles.progress}>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`${styles.progressDot} ${i === index ? styles.progressActive : ""} ${
                i < index ? styles.progressDone : ""
              }`}
            />
          ))}
        </div>
        <h2 id="tour-title" className={styles.title}>
          {step.title}
        </h2>
        <p className={styles.body}>{step.body}</p>
        <div className={styles.actions}>
          {!isLast && (
            <button type="button" className={styles.skip} onClick={finish}>
              Skip tour
            </button>
          )}
          <div className={styles.navButtons}>
            {index > 0 && (
              <button type="button" className={styles.back} onClick={back}>
                Back
              </button>
            )}
            <button
              type="button"
              ref={nextRef}
              className={styles.next}
              onClick={next}
            >
              {index === 0 ? "Start tour" : isLast ? "Let's go" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Tour;
