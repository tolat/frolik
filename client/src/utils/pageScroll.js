// App shell (index.css, MainContainer): page content scrolls inside
// #page-scroller; the document itself never scrolls. Read and set the page
// scroll through these helpers.
export const pageScroller = () =>
  document.getElementById("page-scroller") ||
  document.scrollingElement ||
  document.documentElement;

export const pageScrollTop = () => pageScroller().scrollTop;

export const scrollPageTo = (top, behavior = "auto") =>
  pageScroller().scrollTo({ top, behavior });

// Stop/allow page scrolling while a slide-in panel covers it
export const setPageScrollLocked = (locked) => {
  const el = document.getElementById("page-scroller");
  if (el) el.style.overflowY = locked ? "hidden" : "";
};

// iOS Safari: after the photo picker or the keyboard closes, the window can be
// left scrolled/offset (iOS scrolls it to reveal the focused field and never
// scrolls back). The document has nothing to scroll in the app shell, so
// putting the window back at 0 is always right.
const snapBack = () => {
  const vv = window.visualViewport;
  if (window.scrollY !== 0 || (vv && Math.abs(vv.offsetTop) > 0.5)) {
    window.scrollTo(0, 0);
  }
};

export const resetViewportShift = () => {
  // The keyboard animates away over ~0.3s and iOS can re-shift during it
  [0, 120, 350, 700].forEach((ms) =>
    setTimeout(() => requestAnimationFrame(snapBack), ms)
  );
};

const isTextField = (el) =>
  !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== "file";

// Install once:
//  - touch devices: while a text field has focus (keyboard up), add
//    html.keyboard-open — hides the bottom nav bar and drops the nav-bar
//    clearance under panels/chat, so the field sits just above the keyboard
//  - when the keyboard closes, snap the window back (several times while the
//    keyboard animates away)
//  - while nothing is focused, never leave the window offset
let guardInstalled = false;
export const installViewportShiftGuard = () => {
  if (guardInstalled) return;
  guardInstalled = true;
  const touch = window.matchMedia?.("(pointer: coarse)").matches;
  const root = document.documentElement;

  document.addEventListener("focusin", (e) => {
    if (touch && isTextField(e.target)) root.classList.add("keyboard-open");
  });

  document.addEventListener("focusout", () =>
    setTimeout(() => {
      if (isTextField(document.activeElement)) return; // moved to another field
      root.classList.remove("keyboard-open");
      resetViewportShift();
    }, 60)
  );

  const vv = window.visualViewport;
  const guard = () => {
    if (isTextField(document.activeElement)) return; // keyboard up: iOS's turn
    requestAnimationFrame(snapBack);
  };
  window.addEventListener("scroll", guard, { passive: true });
  if (vv) {
    vv.addEventListener("scroll", guard);
    vv.addEventListener("resize", guard);
  }
};
