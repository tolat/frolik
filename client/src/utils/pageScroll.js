// The page scrolls inside <body>, not the document (see index.css), so
// window.scrollY / window.scrollTo don't apply. Use these instead.
export const pageScroller = () => document.body;

export const pageScrollTop = () => document.body.scrollTop;

export const scrollPageTo = (top, behavior = "auto") =>
  document.body.scrollTo({ top, behavior });
