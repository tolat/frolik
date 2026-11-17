import { useEffect, useRef } from "react";

// App-wide pull-to-refresh. refreshPage() broadcasts a refresh to whatever
// page is showing; pages opt in with usePageRefresh(fn) and the spinner stays
// up until every returned promise settles (min 600ms so it never flickers).
const REFRESH_EVENT = "frolik:refresh";

export const refreshPage = async () => {
  const waits = [];
  window.dispatchEvent(
    new CustomEvent(REFRESH_EVENT, {
      detail: { waitFor: (p) => waits.push(Promise.resolve(p).catch(() => {})) },
    })
  );
  await Promise.all([
    Promise.all(waits),
    new Promise((resolve) => setTimeout(resolve, 600)),
  ]);
};

export const usePageRefresh = (fn) => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    const onRefresh = (e) => e.detail?.waitFor(fnRef.current?.());
    window.addEventListener(REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
  }, []);
};
