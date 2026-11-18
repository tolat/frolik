// The page scrolls the document itself (see index.css). Read and set it here
// rather than poking window/document directly, so the scroller can change in
// one place.
export const pageScroller = () =>
  document.scrollingElement || document.documentElement;

export const pageScrollTop = () => window.scrollY || pageScroller().scrollTop;

export const scrollPageTo = (top, behavior = "auto") =>
  window.scrollTo({ top, behavior });

// Stop/allow page scrolling while a slide-in panel covers it
export const setPageScrollLocked = (locked) => {
  document.documentElement.style.overflowY = locked ? "clip" : "";
};

// iOS Safari: after the native photo picker, the keyboard, or a select
// menu closes, the view can stay shifted — iOS scrolled the document to show
// the focused field (even when the page behind a panel is locked) and never
// scrolls it back, leaving the app pannable by about the status-bar height
// with the fixed nav riding up. Put the page back where it was.
let savedScrollTop = null; // page scroll when typing started

const snapBack = () => {
  const target = savedScrollTop ?? pageScrollTop();
  const vv = window.visualViewport;
  const shifted =
    pageScrollTop() !== target || (vv && Math.abs(vv.offsetTop) > 0.5);
  if (shifted) window.scrollTo(0, target);
};

export const resetViewportShift = () => {
  // The keyboard animates away over ~0.3s and iOS can re-shift during it:
  // snap now and a few more times while it settles
  [0, 120, 350, 700].forEach((ms) =>
    setTimeout(() => requestAnimationFrame(snapBack), ms)
  );
};

const isTextField = (el) =>
  !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== "file";

// Install once:
//  - touch devices: while a text field has focus (keyboard up), add
//    html.keyboard-open — hides the bottom nav bar (iOS scrolls the whole
//    view while typing) and drops the nav-bar clearance under panels/chat,
//    so the field sits just above the keyboard
//  - remember the page scroll when typing starts; when the keyboard closes,
//    put it back (several times while the keyboard animates away)
//  - while nothing is focused, don't let the view stay panned: if iOS
//    leaves it offset, snap it back
let guardInstalled = false;
export const installViewportShiftGuard = () => {
  if (guardInstalled) return;
  guardInstalled = true;
  const touch = window.matchMedia?.("(pointer: coarse)").matches;
  const root = document.documentElement;

  document.addEventListener("focusin", (e) => {
    if (!isTextField(e.target)) return;
    if (!root.classList.contains("keyboard-open")) savedScrollTop = pageScrollTop();
    if (touch) root.classList.add("keyboard-open");
  });

  document.addEventListener("focusout", () =>
    setTimeout(() => {
      if (isTextField(document.activeElement)) return; // moved to another field
      root.classList.remove("keyboard-open");
      resetViewportShift();
      setTimeout(() => (savedScrollTop = null), 800);
    }, 60)
  );

  const vv = window.visualViewport;
  if (vv && touch) {
    let raf = 0;
    const guard = () => {
      if (isTextField(document.activeElement)) return; // keyboard up: iOS's turn
      if (Math.abs(vv.offsetTop) < 0.5) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => window.scrollTo(0, pageScrollTop()));
    };
    vv.addEventListener("scroll", guard);
    vv.addEventListener("resize", guard);
  }
};
