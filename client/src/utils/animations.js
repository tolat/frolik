// Fade a list item out and smoothly collapse it to zero height, then call
// `done` (which normally removes it from state). Collapses from the element's
// real height so the items below glide up instead of jumping.
// `done` always runs exactly once, even if the animation's finish event is
// delayed (e.g. in a backgrounded tab).
export const collapseOut = (el, done, { delay = 0, duration = 420 } = {}) => {
  if (!el?.animate) return done();
  if (el.dataset.collapsing) return;
  el.dataset.collapsing = "true";

  const cs = getComputedStyle(el);
  el.style.overflow = "hidden";
  const anim = el.animate(
    [
      {
        opacity: 1,
        transform: "none",
        height: `${el.offsetHeight}px`,
        marginBottom: cs.marginBottom,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
      },
      { opacity: 0, transform: "scale(0.97)", offset: 0.45 },
      {
        opacity: 0,
        transform: "scale(0.97)",
        height: "0px",
        marginBottom: "0px",
        paddingTop: "0px",
        paddingBottom: "0px",
      },
    ],
    { duration, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
  );

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    done();
  };
  anim.onfinish = finish;
  setTimeout(finish, delay + duration + 120);
};
