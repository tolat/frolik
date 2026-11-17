import styles from "./styles/SkeletonCards.module.scss";
import { shineSync } from "../../utils/shine";

// List placeholders: plain shining tiles, the same look and size as the
// loading state of the cards they stand in for (so there is one tile type).
// variant: "feed" | "chat" | "activity" | "person"
const SkeletonCards = ({ count = 3, variant = "chat" }) => (
  <div className={styles.list} role="status" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`${styles.tile} ${styles[variant]} shine-loading`}
        style={shineSync()}
      />
    ))}
  </div>
);

export default SkeletonCards;
