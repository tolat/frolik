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
// menu closes, the visual viewport can stay shifted up — fixed headers then
// sit under the status bar ("forehead") until something scrolls. Scrolling
// the page to where it already is snaps the viewport back.
export const resetViewportShift = () => {
  requestAnimationFrame(() => {
    const vv = window.visualViewport;
    if (vv && vv.offsetTop === 0 && vv.pageTop === pageScrollTop()) return;
    window.scrollTo(0, pageScrollTop());
  });
};

const isTextField = (el) =>
  !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== "file";

// Install once: snap back whenever a text field loses focus (keyboard
// closed) and nothing else has taken focus
let guardInstalled = false;
export const installViewportShiftGuard = () => {
  if (guardInstalled) return;
  guardInstalled = true;
  document.addEventListener("focusout", () =>
    setTimeout(() => {
      if (!isTextField(document.activeElement)) resetViewportShift();
    }, 60)
  );
};
