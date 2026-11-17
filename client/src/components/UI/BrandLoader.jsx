import styles from "./styles/BrandLoader.module.scss";
import balloon from "../../images/air-balloon-blue.png";

// On-brand loading spinner (same look as pull-to-refresh): a spinning ring
// with the frolik balloon bobbing inside. `size` in rem; optional `label`.
const BrandLoader = ({ size = 4.6, label, className, inline }) => (
  <div
    className={`${styles.wrap} ${inline ? styles.inline : ""} ${className || ""}`}
    role="status"
    aria-live="polite"
  >
    <div className={styles.bubble} style={{ width: `${size}rem`, height: `${size}rem` }}>
      <svg className={styles.ring} viewBox="0 0 36 36" aria-hidden="true">
        <circle className={styles.track} cx="18" cy="18" r="15" />
        <circle className={styles.arc} cx="18" cy="18" r="15" />
      </svg>
      <img src={balloon} alt="" className={styles.balloon} />
    </div>
    {label ? (
      <span className={styles.label}>{label}</span>
    ) : (
      <span className={styles.srOnly}>Loading</span>
    )}
  </div>
);

export default BrandLoader;
