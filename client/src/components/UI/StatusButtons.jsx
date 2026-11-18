import { useEffect, useState } from "react";
import styles from "./styles/StatusButtons.module.scss";
import { useT } from "../../i18n";

// hint: ui.statusButtons.hints.<tone>
const OPTIONS = [
  { value: "Ready", tone: "ready" },
  { value: "Busy", tone: "busy" },
];

// Ready / Busy picker: the selected button fills with its colour.
const StatusButtons = ({ id, label, defaultVal, setDataChanged }) => {
  const { t, tOr } = useT();
  const [value, setValue] = useState(defaultVal);
  useEffect(() => setValue(defaultVal), [defaultVal]);

  const select = (v) => {
    setValue(v);
    setDataChanged?.(v);
  };
  const selected = OPTIONS.find((o) => o.value === value);

  return (
    <div id={id} className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.buttons} role="radiogroup" aria-label={t("ui.statusButtons.label")}>
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            className={`${styles.button} ${styles[o.tone]} ${
              value === o.value ? styles.selected : ""
            }`}
            onClick={() => select(o.value)}
          >
            <span className={styles.dot} />
            {tOr("data.statuses." + o.value, o.value)}
          </button>
        ))}
      </div>
      <div className={styles.hint}>
        {selected
          ? t(`ui.statusButtons.hints.${selected.tone}`)
          : value
          ? t("ui.statusButtons.currently", {
              status: tOr("data.statuses." + value, value),
            })
          : t("ui.statusButtons.choose")}
      </div>
    </div>
  );
};

export default StatusButtons;
