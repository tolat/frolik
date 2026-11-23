import { useState } from "react";
import styles from "./styles/AutoLocationToggle.module.scss";
import { getThemeMode, setThemeMode } from "../../utils/themeMode";
import { useT } from "../../i18n";

// Settings switch: dark mode on this device. Same look as "Notifications".
const DarkModeToggle = () => {
  const { t } = useT();
  const [on, setOn] = useState(() => getThemeMode() === "dark");

  const toggle = () => {
    const next = !on;
    setThemeMode(next ? "dark" : "light");
    setOn(next);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={styles.row}
        onClick={toggle}
      >
        <span className={styles.text}>
          <span className={styles.title}>{t("settings.darkMode.title")}</span>
          <span className={styles.caption}>
            {t(on ? "settings.darkMode.on" : "settings.darkMode.off")}
          </span>
        </span>
        <span className={`${styles.switch} ${on ? styles.switchOn : ""}`}>
          <span className={styles.knob} />
        </span>
      </button>
    </div>
  );
};

export default DarkModeToggle;
