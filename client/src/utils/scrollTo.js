// Scroll an element into view by scrolling only its nearest scroll container
// (or the page). Used instead of element.scrollIntoView(), which on iOS can
// also shift the whole viewport — in installed apps that moved the fixed nav
// bar by about the height of the status bar.
const scrollParent = (el) => {
  let p = el?.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === "auto" || oy === "scroll") && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return null;
};

export const scrollToElement = (
  el,
  { block = "start", behavior = "smooth", offset = 0 } = {}
) => {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const parent = scrollParent(el);
  const viewTop = parent ? parent.getBoundingClientRect().top : 0;
  const viewHeight = parent ? parent.clientHeight : window.innerHeight;
  let delta = rect.top - viewTop - offset;
  if (block === "center") delta -= (viewHeight - rect.height) / 2;
  if (parent) {
    parent.scrollTo({ top: Math.max(0, parent.scrollTop + delta), behavior });
  } else {
    window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior });
  }
};
