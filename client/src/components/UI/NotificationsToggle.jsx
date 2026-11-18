import { useEffect, useState } from "react";
import styles from "./styles/AutoLocationToggle.module.scss";
import {
  disablePush,
  enablePush,
  hasServiceWorker,
  isPushOn,
  pushPermission,
} from "../../utils/push";
import { useT } from "../../i18n";

const isIOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isInstalled = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)").matches;

// Settings switch: notifications on this device. Same look as "Keep my
// location up to date". When notifications can't work here the row says why
// (blocked in phone settings, iPhone not added to the Home Screen…).
const NotificationsToggle = () => {
  const { t } = useT();
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(null); // "on" | "off" while switching
  const [state, setState] = useState("checking"); // ready | blocked | installFirst | unsupported

  const refresh = async () => {
    if (isIOS() && !isInstalled()) return setState("installFirst");
    const permission = pushPermission();
    if (permission === "unsupported") return setState("unsupported");
    if (permission === "denied") return setState("blocked");
    if (!(await hasServiceWorker())) return setState("unsupported");
    setOn(await isPushOn());
    setState("ready");
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggle = async () => {
    if (busy || state !== "ready") return;
    if (on) {
      setBusy("off");
      await disablePush();
    } else {
      setBusy("on");
      await enablePush(); // asks for permission the first time
    }
    setBusy(null);
    await refresh();
  };

  const disabled = state !== "ready" || !!busy;
  const caption = busy
    ? t(busy === "on" ? "push.toggle.turningOn" : "push.toggle.turningOff")
    : state === "ready"
    ? t(on ? "push.toggle.on" : "push.toggle.off")
    : state === "checking"
    ? t("push.toggle.off")
    : t(`push.toggle.${state}`);

  return (
    <div className={styles.container}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={styles.row}
        onClick={toggle}
        disabled={disabled}
        style={state !== "ready" && state !== "checking" ? { cursor: "default" } : null}
      >
        <span className={styles.text}>
          <span className={styles.title}>{t("push.toggle.title")}</span>
          <span className={styles.caption}>{caption}</span>
        </span>
        <span
          className={`${styles.switch} ${on ? styles.switchOn : ""}`}
          style={state !== "ready" && state !== "checking" ? { opacity: 0.45 } : null}
        >
          <span className={styles.knob} />
        </span>
      </button>
    </div>
  );
};

export default NotificationsToggle;
