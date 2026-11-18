import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyPopup from "./EmptyPopup";
import store from "../../store";
import { popupActions } from "../../store/popup-slice";
import {
  enablePush,
  hasServiceWorker,
  pushPermission,
  pushSupported,
  switchedOff,
} from "../../utils/push";
import { useT } from "../../i18n";
import styles from "./styles/PushDrawer.module.scss";

export const PUSH_SELECTOR = "push-prompt";

// Running as the installed app (iOS home screen or any PWA window)
const isInstalled = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)").matches;
const isIOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// Push can be offered here: iOS only from the Home Screen app; other
// browsers (Android, desktop) can do it on the website too
const canOfferPush = () => pushSupported() && (!isIOS() || isInstalled());

// Notifications are off but could be turned on: never decided, or switched
// off in settings (blocked in the browser can't be asked again)
const pushIsOff = () => {
  const permission = pushPermission();
  return permission === "default" || (permission === "granted" && switchedOff());
};

// When to offer it next: the first time right away, then at a random time
// 2–4 weeks after each showing (a gentle reminder, never a nag)
const NEXT_KEY = "frolik:push-prompt-next";
const DAY_MS = 24 * 60 * 60 * 1000;
const dueNow = () => {
  try {
    const next = Number(localStorage.getItem(NEXT_KEY));
    return !next || Date.now() >= next;
  } catch {
    return true;
  }
};
const scheduleNext = () => {
  try {
    const days = 14 + Math.random() * 14;
    localStorage.setItem(NEXT_KEY, String(Date.now() + days * DAY_MS));
  } catch {}
};

// "Turn on notifications" drawer: opens by itself while notifications are
// off (first time right away, then every 2–4 weeks). iOS only lets a page ask
// for permission from a tap, so the Turn on button does the asking. "Not now"
// asks once more before closing. Waits until the app tour is done and no
// other drawer is open.
const PushDrawer = () => {
  const { t } = useT();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [busy, setBusy] = useState(false);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const tourDone = !!user?.tour_seen;

  useEffect(() => {
    if (!user?._id || !tourDone) return;
    if (!canOfferPush() || !pushIsOff() || !dueNow()) return;
    let cancelled = false;
    let tries = 0;
    const timer = setInterval(async () => {
      tries++;
      if (tries > 90) return clearInterval(timer); // give up for this launch
      // the service worker registers after sign-in; push needs it
      if (!(await hasServiceWorker()) || cancelled) return;
      if (store.getState().popup.selector !== "none") return;
      clearInterval(timer);
      scheduleNext();
      setConfirmSkip(false);
      dispatch(popupActions.showPopup(PUSH_SELECTOR));
    }, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [dispatch, user?._id, tourDone]);

  const close = () => dispatch(popupActions.hidePopup());

  // First tap on "Not now" asks again; the second one closes
  const onNotNow = () => {
    if (!confirmSkip) return setConfirmSkip(true);
    close();
  };

  const onEnable = async () => {
    setBusy(true);
    await enablePush(); // asks; subscribes this device if allowed
    setBusy(false);
    close();
  };

  return (
    <EmptyPopup selector={PUSH_SELECTOR} label={t("push.drawer.title")}>
      <div className={styles.container}>
        <div className={styles.bell} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3a6 6 0 0 0-6 6v3.6L4.4 15.5A1 1 0 0 0 5.3 17h13.4a1 1 0 0 0 .9-1.5L18 12.6V9a6 6 0 0 0-6-6z" />
            <path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" />
          </svg>
          <span className={styles.dot} />
        </div>
        <h2 className={styles.title}>{t("push.drawer.title")}</h2>
        <p className={styles.body}>{t("push.drawer.body")}</p>
        <p className={styles.noEmails}>{t("push.drawer.noEmails")}</p>
        <ul className={styles.list}>
          <li>{t("push.drawer.item1")}</li>
          <li>{t("push.drawer.item2")}</li>
          <li>{t("push.drawer.item3")}</li>
        </ul>
        <div className={styles.buttons}>
          <button type="button" className={styles.enable} onClick={onEnable} disabled={busy}>
            {busy ? "…" : t("push.drawer.enable")}
          </button>
          {confirmSkip && (
            <p className={styles.skipWarning} role="alert">
              {t("push.drawer.skipWarning")}
            </p>
          )}
          <button type="button" className={styles.later} onClick={onNotNow}>
            {confirmSkip ? t("push.drawer.confirmSkip") : t("push.drawer.notNow")}
          </button>
        </div>
      </div>
    </EmptyPopup>
  );
};

export default PushDrawer;
