import styles from "./styles/BrandLoader.module.scss";
import balloon from "../../images/air-balloon-blue.png";
import TintedIcon from "./TintedIcon";
import { T } from "../../i18n";

// On-brand loading spinner (same look as pull-to-refresh): a spinning ring
// with the frolik balloon bobbing inside. `size` in rem; optional `label`.
// Ring only, for buttons: `noBalloon` drops the balloon, `plain` drops the
// white bubble behind it, `light` = white arc (for blue buttons).
const BrandLoader = ({
  size = 4.6,
  label,
  className,
  inline,
  noBalloon,
  plain,
  light,
}) => (
  <div
    className={`${styles.wrap} ${inline ? styles.inline : ""} ${
      plain ? styles.plain : ""
    } ${light ? styles.light : ""} ${className || ""}`}
    role="status"
    aria-live="polite"
  >
    <div className={styles.bubble} style={{ width: `${size}rem`, height: `${size}rem` }}>
      <svg className={styles.ring} viewBox="0 0 36 36" aria-hidden="true">
        <circle className={styles.track} cx="18" cy="18" r="15" />
        <circle className={styles.arc} cx="18" cy="18" r="15" />
      </svg>
      {noBalloon ? null : <TintedIcon src={balloon} className={styles.balloon} />}
    </div>
    {label ? (
      <span className={styles.label}>{label}</span>
    ) : (
      <span className={styles.srOnly}>
        <T k="ui.loading" />
      </span>
    )}
  </div>
);

export default BrandLoader;
