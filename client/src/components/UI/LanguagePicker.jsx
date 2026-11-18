import { useDispatch, useSelector } from "react-redux";
import EmptyPopup from "../Popups/EmptyPopup";
import { popupActions } from "../../store/popup-slice";
import { authActions } from "../../store/auth-slice";
import { LANGUAGES } from "../../i18n/languages";
import { setLanguage, useT } from "../../i18n";
import httpFetch from "../../utils/http-fetch";
import { getServer } from "../../utils/env-utils";
import styles from "./styles/LanguagePicker.module.scss";

// "Language" row (settings, sign-up, login) that opens a drawer of every
// language Frolik ships with. Picking one switches the app right away; with
// save={true} (signed in) it's also stored on the account so emails, push
// notifications and other devices follow it.
const LanguagePicker = ({ save = false, compact = false, selector = "language-picker" }) => {
  const { t, lang } = useT();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const currentName = LANGUAGES.find((l) => l.code === lang)?.name || lang;

  const choose = async (code) => {
    dispatch(popupActions.hidePopup());
    await setLanguage(code);
    if (save && user?._id) {
      httpFetch(
        {
          url: `${getServer()}/user/${user._id}/profile-data`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileData: { language: code } }),
        },
        (response) => {
          if (response?.user) {
            dispatch(
              authActions.setUser({
                ...response.user,
                friends: response.populatedFriends || user.friends,
              })
            );
          }
        },
        () => {}
      );
    }
  };

  const open = () => dispatch(popupActions.showPopup(selector));

  return (
    <>
      {compact ? (
        <button type="button" className={styles.compact} onClick={open}>
          <GlobeIcon />
          <span>{currentName}</span>
        </button>
      ) : (
        <div className={styles.container}>
          <button type="button" className={styles.row} onClick={open}>
            <span className={styles.icon}>
              <GlobeIcon />
            </span>
            <span className={styles.text}>
              <span className={styles.title}>{t("common.language.label")}</span>
              <span className={styles.caption}>{t("common.language.hint")}</span>
            </span>
            <span className={styles.value}>{currentName}</span>
            <span className={styles.chevron} aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      )}
      <EmptyPopup selector={selector} label={t("common.language.label")}>
        <h2 className={styles.sheetTitle}>{t("common.language.label")}</h2>
        <ul className={styles.list} role="listbox" aria-label={t("common.language.label")}>
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  lang={l.code}
                  dir={l.dir || "ltr"}
                  className={`${styles.option} ${selected ? styles.selected : ""}`}
                  onClick={() => choose(l.code)}
                >
                  <span className={styles.optionText}>
                    <span className={styles.native}>{l.name}</span>
                    {l.english !== l.name && (
                      <span className={styles.english} lang="en" dir="ltr">
                        {l.english}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </EmptyPopup>
    </>
  );
};

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="lang-globe">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" />
  </svg>
);

export default LanguagePicker;
