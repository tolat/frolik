import { useEffect, useState } from "react";
import styles from "./styles/StatusButtons.module.scss";

const OPTIONS = [
  { value: "Ready", tone: "ready", hint: "Open to Outings — you'll appear in Daily Matches" },
  { value: "Busy", tone: "busy", hint: "Taking a break — you won't be matched" },
];

// Ready / Busy picker: the selected button fills with its colour.
const StatusButtons = ({ id, label, defaultVal, setDataChanged }) => {
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
      <div className={styles.buttons} role="radiogroup" aria-label="Status">
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
            {o.value}
          </button>
        ))}
      </div>
      <div className={styles.hint}>
        {selected ? selected.hint : value ? `Currently ${value}` : "Choose your status"}
      </div>
    </div>
  );
};

export default StatusButtons;
