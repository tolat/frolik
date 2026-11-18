import styles from "./styles/StarRate.module.scss";
import { useT } from "../../i18n";

// 1-5 star picker. rating 0 shows all stars empty (nothing picked yet).
const StarRate = (props) => {
  const { t } = useT();
  const pick = (n) => {
    props.setTouched?.(true);
    props.setRating(n);
  };

  return (
    <div className={styles.container} role="radiogroup" aria-label={t("ui.starRate.label")}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= props.rating;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={props.rating === n}
            aria-label={t("ui.starRate.stars", { count: n })}
            className={`${styles.star} ${filled ? styles.filled : ""}`}
            onClick={() => pick(n)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRate;
