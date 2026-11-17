import { useEffect, useState } from "react";
import styles from "./styles/PushPrompt.module.scss";
import { enablePush, hasServiceWorker, pushPermission } from "../../utils/push";

const isIOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)").matches;

// Asks for notification permission from a real tap (required by iOS and
// increasingly by Chrome). Renders nothing once notifications are on.
const PushPrompt = ({ compact }) => {
  const [permission, setPermission] = useState(pushPermission());
  const [swReady, setSwReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    hasServiceWorker().then((ok) => alive && setSwReady(ok));
    return () => {
      alive = false;
    };
  }, []);

  // iOS only supports web push for apps added to the Home Screen
  if (isIOS() && !isStandalone()) {
    return compact ? null : (
      <div className={`${styles.card} ${styles.muted}`}>
        <BellIcon />
        <div className={styles.text}>
          <div className={styles.title}>Want notifications?</div>
          <div>Add frolik to your Home Screen (Share → Add to Home Screen), then turn them on.</div>
        </div>
      </div>
    );
  }

  if (!swReady || permission === "granted" || permission === "unsupported") {
    return null;
  }

  if (permission === "denied") {
    return (
      <div className={`${styles.card} ${styles.muted} ${compact ? styles.compact : ""}`}>
        <BellIcon />
        <div className={styles.text}>
          Notifications are blocked. Turn them on for frolik in your browser or phone settings.
        </div>
      </div>
    );
  }

  const onEnable = async () => {
    setBusy(true);
    const result = await enablePush();
    setBusy(false);
    setPermission(result === "error" ? pushPermission() : result);
  };

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ""}`}>
      <BellIcon />
      <div className={styles.text}>
        <div className={styles.title}>Turn on notifications</div>
        {!compact && <div>Get told about invites, messages and friend requests.</div>}
      </div>
      <button type="button" className={styles.button} onClick={onEnable} disabled={busy}>
        {busy ? "…" : "Turn on"}
      </button>
    </div>
  );
};

const BellIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
    <path
      d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2H4.5zM10 20.5a2 2 0 0 0 4 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PushPrompt;
