const isSupported = () =>
'Notification' in window &&
'serviceWorker' in navigator &&
'PushManager' in window

export const setBadge = (value) => {
  if (!isSupported() || !navigator.setAppBadge) return;
  const n = Number(value) || 0;
  (n > 0 ? navigator.setAppBadge(n) : navigator.clearAppBadge()).catch(() => {});
};

export const clearBadge = () => {
  if (isSupported() && navigator.clearAppBadge) {
    navigator.clearAppBadge().catch(() => {});
  }
};


export const resetBadge = () => {
  setBadge(0);
};