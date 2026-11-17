import styles from "./styles/SkeletonCards.module.scss";

// Card-shaped placeholders with the loading shine, so a list keeps its
// layout while it loads. variant: "feed" | "chat" | "activity" | "person"
const SkeletonCards = ({ count = 3, variant = "chat" }) => (
  <div className={styles.list} role="status" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`${styles.card} ${styles[variant]}`}>
        {variant === "feed" && <div className={`${styles.media} shine-loading`} />}
        {variant === "activity" && <div className={`${styles.activityMedia} shine-loading`} />}
        {(variant === "chat" || variant === "person" || variant === "feed") && (
          <div className={styles.row}>
            <div className={`${styles.avatar} shine-loading`} />
            <div className={styles.lines}>
              <div className={`${styles.line} ${styles.lineWide} shine-loading`} />
              <div className={`${styles.line} shine-loading`} />
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default SkeletonCards;
