import styles from "./styles/CircleAction.module.scss";

// Round action button with a small label under it (+ Chat, + Outing,
// + Friend, Unfriend…), matching the round chat button on the Outing page.
// tone: "primary" (blue gradient, default) | "secondary" (grey) |
// "locked" (grey, faded; still clickable so it can explain why).
// compact: a little smaller, for the profile header next to the name.
const CircleAction = ({ icon, label, onClick, tone = "primary", compact }) => (
  <button
    type="button"
    className={`${styles.action} ${styles[tone] || ""} ${
      compact ? styles.compact : ""
    }`}
    onClick={(e) => {
      e.stopPropagation(); // don't also open the card's profile
      onClick && onClick(e);
    }}
    aria-label={label}
  >
    <span className={styles.circle}>
      <img src={icon} alt="" className={styles.icon} />
    </span>
    <span className={styles.label}>{label}</span>
  </button>
);

export default CircleAction;
