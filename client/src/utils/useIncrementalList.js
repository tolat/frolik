import { useEffect, useRef, useState } from "react";

// Render a long list a few items at a time: shows `pageSize` items, then adds
// another page whenever the sentinel element (rendered after the list) comes
// within `rootMargin` of the viewport. Resets when `resetKey` changes (e.g. a
// search term).
export default function useIncrementalList(items, pageSize = 5, resetKey) {
  const [count, setCount] = useState(pageSize);
  const sentinelRef = useRef(null);
  const total = items?.length || 0;
  const hasMore = count < total;

  useEffect(() => {
    setCount(pageSize);
  }, [resetKey, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || !("IntersectionObserver" in window)) {
      if (hasMore && !("IntersectionObserver" in window)) setCount(total);
      return;
    }
    // Re-created after each page so a sentinel that is still on screen
    // immediately loads the next page too
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCount((c) => Math.min(c + pageSize, total));
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, pageSize, count, total]);

  return { visible: (items || []).slice(0, count), hasMore, sentinelRef };
}
