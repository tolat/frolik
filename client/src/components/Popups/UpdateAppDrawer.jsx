import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../Modals/styles/InstallPromptModal.module.scss";
import store from "../../store";
import appIcon from "../../images/brand/app-icon.png";
import safari from "../../images/safari.png";
import EmptyPopup from "./EmptyPopup";
import { popupActions } from "../../store/popup-slice";
import { useT, T } from "../../i18n";

// "Update Frolik": asks people to delete and reinstall the home-screen app
// when a change can't reach it by refreshing (manifest, icon, splash screen,
// service worker).
//
// How it knows: globals.appInstallVersion (seeds/globals.js on the server).
// The installed app stamps itself with that number the first time it runs
// (localStorage, which a reinstall wipes). When the number is bumped and
// deployed, apps stamped with an older number show this drawer; a fresh
// install is stamped with the new number, so it stops.
//
// Only in the installed app: in a browser tab a refresh already gets
// everything. /?update-app=1 shows it anywhere (to preview it).
export const UPDATE_SELECTOR = "update-app";

const STAMP_KEY = "frolik:install-version";
const SNOOZE_KEY = "frolik:update-app-snoozed";
const DAY_MS = 24 * 60 * 60 * 1000;

const isInstalled = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)").matches;
const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const preview = (() => {
  try {
    return new URLSearchParams(window.location.search).get("update-app") === "1";
  } catch {
    return false;
  }
})();

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
};

// Stamp a first run with the current number; true when this install is older
export const installIsOutdated = (current) => {
  if (!Number.isFinite(current)) return false;
  const stamp = Number(read(STAMP_KEY));
  if (!read(STAMP_KEY) || !Number.isFinite(stamp)) {
    write(STAMP_KEY, current);
    return false;
  }
  return stamp < current;
};

const UpdateAppDrawer = () => {
  const { t } = useT();
  const dispatch = useDispatch();
  const current = useSelector((state) => state.auth.globals?.appInstallVersion);
  const [ios] = useState(isIos);

  useEffect(() => {
    if (!preview) {
      if (!isInstalled() || !installIsOutdated(current)) return;
      const snoozed = Number(read(SNOOZE_KEY));
      if (snoozed > 0 && Date.now() - snoozed < DAY_MS) return;
    }
    // Wait for a moment with no other drawer open
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (store.getState().popup.selector === "none") {
        clearInterval(timer);
        dispatch(popupActions.showPopup(UPDATE_SELECTOR));
      } else if (tries > 60) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [current, dispatch]);

  const later = () => {
    write(SNOOZE_KEY, Date.now());
    dispatch(popupActions.hidePopup());
  };

  const step = (n, k, icon) => (
    <li className={styles.step} key={k}>
      <span className={styles.stepNumber}>{n}</span>
      <span className={styles.stepText}>
        <T k={k} />
      </span>
      {icon}
    </li>
  );

  return (
    <EmptyPopup selector={UPDATE_SELECTOR} label={t("updateApp.title")}>
      <div className={styles.container}>
        <img className={styles.appIcon} src={appIcon} alt="" />
        <h2 className={styles.title}>{t("updateApp.title")}</h2>
        <p className={styles.subtitle}>{t("updateApp.subtitle")}</p>
        <ol className={styles.steps}>
          {ios
            ? [
                step(1, "updateApp.ios.step1"),
                step(2, "updateApp.ios.step2"),
                step(3, "updateApp.ios.step3", <img className={styles.stepIcon} src={safari} alt="" />),
                step(4, "updateApp.ios.step4"),
              ]
            : [
                step(1, "updateApp.android.step1"),
                step(2, "updateApp.android.step2"),
                step(3, "updateApp.android.step3"),
              ]}
        </ol>
        <p className={styles.note}>{t("updateApp.note")}</p>
        <div className={styles.buttons}>
          <button type="button" className={styles.laterButton} onClick={later}>
            {t("updateApp.later")}
          </button>
        </div>
      </div>
    </EmptyPopup>
  );
};

export default UpdateAppDrawer;
