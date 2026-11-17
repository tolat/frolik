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
