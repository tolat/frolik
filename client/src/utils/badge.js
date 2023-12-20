const isSupported = () =>
'Notification' in window &&
'serviceWorker' in navigator &&
'PushManager' in window

export const setBadge = (value) => {
  if (isSupported()) {
    navigator.setAppBadge(value);
  }
};

export const clearBadge = () => {
  if (isSupported()) {
    navigator.clearAppBadge();
  }
};

export const incrementBadge = () => {
  if (isSupported()) {
    const currentBadge = navigator.getBadge();
    const newBadgeValue = currentBadge ? currentBadge + 1 : 1;
    setBadge(newBadgeValue);
  }
};

export const resetBadge = () => {
  setBadge(0);
};