import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./styles/InstallPromptModal.module.scss";
import store from "../../store";
import safari from "../../images/safari.png";
import appIcon from "../../images/brand/app-icon.png";
import EmptyPopup from "../Popups/EmptyPopup";
import { popupActions } from "../../store/popup-slice";
import { useT, T } from "../../i18n";

export const INSTALL_SELECTOR = "install-prompt";

const isIosDevice = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

// Already running as the installed app (iOS home screen or any PWA window)
const isInstalled = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)").matches;

// The automatic prompt shows at most once a day. The time is recorded only
// when the drawer actually opens (it used to be recorded as soon as the
// check ran, so a prompt that was blocked still used up the day).
const LAST_SHOWN_KEY = "frolik:install-prompt-shown";
const DAY_MS = 24 * 60 * 60 * 1000;
const shownRecently = () => {
  try {
    const at = Number(localStorage.getItem(LAST_SHOWN_KEY));
    return at > 0 && Date.now() - at < DAY_MS;
  } catch {
    return false;
  }
};
const recordShown = () => {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {}
};

// iOS Share icon (square with an arrow) and Add-to-Home-Screen icon (plus in
// a rounded square), drawn inline so the steps read like the real buttons
const ShareIcon = () => (
  <svg className={styles.inlineIcon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M7 10H5.5A1.5 1.5 0 0 0 4 11.5v8A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H17" />
  </svg>
);
const AddIcon = () => (
  <svg className={styles.inlineIcon} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M12 8.5v7M8.5 12h7" />
  </svg>
);

// "Get the Frolik app": a bottom drawer. Opens by itself (iPhone in Safari,
// or when Chrome/Android offers an install) at most once a day, or from the
// Install button in settings.
const InstallPromptModal = () => {
  const { t } = useT();
  const dispatch = useDispatch();
  const installEvent = useSelector((state) => state.modal.installPrompted);
  const ios = isIosDevice();

  // Offer it on its own: iPhone Safari (instructions), or when Chrome says
  // the app can be installed (installEvent). Waits for a moment with no
  // other drawer open.
  useEffect(() => {
    if (isInstalled() || shownRecently()) return;
    if (!ios && !installEvent) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (store.getState().popup.selector === "none") {
        clearInterval(timer);
        recordShown();
        dispatch(popupActions.showPopup(INSTALL_SELECTOR));
      } else if (tries > 60) {
        clearInterval(timer); // a drawer stayed open for a minute: try next visit
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch, installEvent, ios]);

  const close = () => dispatch(popupActions.hidePopup());

  const onInstallClick = async () => {
    close();
    if (installEvent) installEvent.prompt();
  };

  return (
    <EmptyPopup selector={INSTALL_SELECTOR} label={t("install.title")}>
      <div className={styles.container}>
        <img
          className={styles.appIcon}
          src={appIcon}
          alt=""
        />
        <h2 className={styles.title}>{t("install.title")}</h2>
        <p className={styles.subtitle}>{t("install.subtitle")}</p>

        {ios ? (
          <>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepText}>
                  <T k="install.ios.step1" />
                </span>
                <img className={styles.stepIcon} src={safari} alt="" />
              </li>
              <li className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepText}>
                  <T k="install.ios.step2" />
                </span>
                <span className={styles.stepGlyph}>
                  <ShareIcon />
                </span>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepText}>
                  <T k="install.ios.step3" />
                </span>
                <span className={styles.stepGlyph}>
                  <AddIcon />
                </span>
              </li>
            </ol>
            <p className={styles.note}>{t("install.ios.note")}</p>
          </>
        ) : installEvent ? null : (
          <p className={styles.otherSteps}>
            <T k="install.other.step" />
          </p>
        )}

        <div className={styles.buttons}>
          {!ios && installEvent && (
            <button type="button" className={styles.installButton} onClick={onInstallClick}>
              {t("install.installButton")}
            </button>
          )}
          <button type="button" className={styles.laterButton} onClick={close}>
            {ios || !installEvent ? t("install.gotIt") : t("install.notNow")}
          </button>
        </div>
      </div>
    </EmptyPopup>
  );
};

export default InstallPromptModal;
