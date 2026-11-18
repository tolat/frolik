import { getServer } from "./env-utils";

// Web push helpers. Browsers (iOS especially) only show the permission prompt
// in response to a real tap, so enablePush() must be called from a click
// handler. syncPush() runs on every app load and quietly re-registers this
// device with the server when permission was already granted.

export const pushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export const pushPermission = () =>
  pushSupported() ? Notification.permission : "unsupported";

// A service worker is only registered in production builds
export const hasServiceWorker = async () => {
  if (!pushSupported()) return false;
  try {
    return !!(await navigator.serviceWorker.getRegistration());
  } catch {
    return false;
  }
};

const urlBase64ToUint8Array = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

const readyRegistration = () =>
  Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("No service worker")), 5000)
    ),
  ]);

const subscribeAndSend = async () => {
  const registration = await readyRegistration();
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    const { key } = await fetch(`${getServer()}/notifications/vapid-public-key`).then(
      (r) => r.json()
    );
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
  }
  // Always send: the server may have pruned it, or another account may have
  // used this device last
  await fetch(`${getServer()}/notifications/push/subscribe`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription }),
  });
};

// Switched off in settings on this device: the quiet sync below must not
// turn it back on just because permission is still granted
const OFF_KEY = "frolik:push-off";
const switchedOff = () => {
  try {
    return localStorage.getItem(OFF_KEY) === "1";
  } catch {
    return false;
  }
};
const setSwitchedOff = (off) => {
  try {
    off ? localStorage.setItem(OFF_KEY, "1") : localStorage.removeItem(OFF_KEY);
  } catch {}
};

// Quiet sync on load — never prompts
export const syncPush = async () => {
  if (pushPermission() !== "granted" || switchedOff()) return;
  try {
    await subscribeAndSend();
  } catch (err) {
    console.log("Push sync skipped:", err.message);
  }
};

// Call from a tap/click. Returns the resulting permission state.
export const enablePush = async () => {
  if (!pushSupported()) return "unsupported";
  setSwitchedOff(false);
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return permission;
  try {
    await subscribeAndSend();
  } catch (err) {
    console.log("Push subscribe failed:", err.message);
    return "error";
  }
  return "granted";
};

// On logout: stop this device receiving the user's notifications
export const removePushFromServer = async () => {
  if (!pushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) return;
    await fetch(`${getServer()}/notifications/push/unsubscribe`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
  } catch {}
};

// Is this device currently set up to receive notifications?
export const isPushOn = async () => {
  if (pushPermission() !== "granted" || switchedOff()) return false;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!(await registration?.pushManager.getSubscription());
  } catch {
    return false;
  }
};

// Settings toggle off: stop notifications on this device only
export const disablePush = async () => {
  setSwitchedOff(true);
  await removePushFromServer();
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    await subscription?.unsubscribe();
  } catch {}
};
