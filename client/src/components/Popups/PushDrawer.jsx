import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyPopup from "./EmptyPopup";
import store from "../../store";
import { popupActions } from "../../store/popup-slice";
import { enablePush, hasServiceWorker, pushPermission } from "../../utils/push";
import { useT } from "../../i18n";
import styles from "./styles/PushDrawer.module.scss";

export const PUSH_SELECTOR = "push-prompt";

// Running as the installed app (iOS home screen or any PWA window)
const isInstalled = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)").matches;

// Shown at most every 3 days, recorded only when it actually opens
const LAST_SHOWN_KEY = "frolik:push-prompt-shown";
const EVERY_MS = 3 * 24 * 60 * 60 * 1000;
const shownRecently = () => {
  try {
    const at = Number(localStorage.getItem(LAST_SHOWN_KEY));
    return at > 0 && Date.now() - at < EVERY_MS;
  } catch {
    return false;
  }
};
const recordShown = () => {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {}
};

// "Turn on notifications" drawer: opens by itself when the installed app is
// launched and notifications haven't been allowed or blocked yet. iOS only
// lets a page ask for permission from a tap, so the Turn on button does the
// asking. Waits until the app tour is done and no other drawer is open.
const PushDrawer = () => {
  const { t } = useT();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [busy, setBusy] = useState(false);
  const tourDone = !!user?.tour_seen;

  useEffect(() => {
    if (!user?._id || !tourDone) return;
    if (!isInstalled() || pushPermission() !== "default" || shownRecently()) return;
    let cancelled = false;
    let tries = 0;
    const timer = setInterval(async () => {
      tries++;
      if (tries > 90) return clearInterval(timer); // give up for this launch
      // the service worker registers after sign-in; push needs it
      if (!(await hasServiceWorker()) || cancelled) return;
      if (store.getState().popup.selector !== "none") return;
      clearInterval(timer);
      recordShown();
      dispatch(popupActions.showPopup(PUSH_SELECTOR));
    }, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [dispatch, user?._id, tourDone]);

  const close = () => dispatch(popupActions.hidePopup());

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
        <ul className={styles.list}>
          <li>{t("push.drawer.item1")}</li>
          <li>{t("push.drawer.item2")}</li>
          <li>{t("push.drawer.item3")}</li>
        </ul>
        <div className={styles.buttons}>
          <button type="button" className={styles.enable} onClick={onEnable} disabled={busy}>
            {busy ? "…" : t("push.drawer.enable")}
          </button>
          <button type="button" className={styles.later} onClick={close}>
            {t("push.drawer.notNow")}
          </button>
        </div>
      </div>
    </EmptyPopup>
  );
};

export default PushDrawer;
