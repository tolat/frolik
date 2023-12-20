export const isBadgeSupported = () => "badge" in Notification.prototype;
export const setBadge = (value) => {
  if (isBadgeSupported()) {
    navigator.setAppBadge(value);
  }
};

export const clearBadge = () => {
  if (isBadgeSupported()) {
    navigator.clearAppBadge();
  }
};

export const incrementBadge = () => {
  if (isBadgeSupported()) {
    const currentBadge = navigator.getBadge();
    const newBadgeValue = currentBadge ? currentBadge + 1 : 1;
    setBadge(newBadgeValue);
  }
};

export const resetBadge = () => {
  setBadge(0);
};