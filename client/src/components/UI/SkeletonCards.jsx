import styles from "./styles/SkeletonCards.module.scss";
import { shineSync } from "../../utils/shine";

// Loading placeholders shaped like the real cards: a white card with grey,
// shining stand-ins for the photo, avatars, text lines and buttons.
// variant: "feed" (Social / completed Outings) | "activity" | "chat" | "person"
//
// SkeletonCard fill={true} covers a card that is still loading (FeedCard,
// ActivityCard) so a list placeholder hands over to the same picture.
const S = ({ className = "" }) => (
  <div className={`${styles.bone} ${className} shine-loading`} />
);

const Lines = ({ widths = ["80%", "55%"], first = styles.lineWide }) => (
  <div className={styles.lines}>
    {widths.map((w, i) => (
      <div
        key={i}
        className={`${styles.line} ${i === 0 ? first : ""} shine-loading`}
        style={{ width: w }}
      />
    ))}
  </div>
);

const Feed = () => (
  <>
    <S className={styles.media} />
    <div className={styles.stripe} />
    <div className={styles.feedFooter}>
      <div className={styles.cluster}>
        <S className={styles.clusterBack} />
        <S className={styles.clusterFront} />
      </div>
      <div className={styles.feedText}>
        <Lines widths={["70%", "48%"]} />
        <S className={styles.pill} />
      </div>
      <S className={styles.heart} />
    </div>
  </>
);

// Activity cards are one big photo with the name, stats and buttons laid
// over it: a grey shining "photo" with lighter bars where the text sits
const O = ({ className = "", style }) => (
  <div className={`${styles.overlay} ${className}`} style={style} />
);

const Activity = () => (
  <div className={styles.activityBody}>
    <div className={styles.sideStripe} />
    <div className={`${styles.activityPhoto} shine-loading`}>
      <div className={styles.activityTop}>
        <div className={styles.activityTitle}>
          <O className={styles.oTitle} />
          <O className={styles.oSub} />
        </div>
        <div className={styles.activityStats}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.oStat}>
              <O className={styles.oStatIcon} />
              <O className={styles.oStatLabel} />
            </div>
          ))}
        </div>
      </div>
      <O className={styles.oDesc} />
      <div className={styles.activityBottom}>
        <O className={styles.oButton} />
        <O className={styles.oSelect} />
      </div>
    </div>
  </div>
);

// Chat list row: colour stripe, two overlapping avatars, name, activity,
// members and "Last Active"
const Chat = () => (
  <div className={styles.chatRow}>
    <div className={styles.sideStripe} />
    <div className={styles.chatCluster}>
      <S className={styles.chatBack} />
      <S className={styles.chatFront} />
    </div>
    <div className={styles.chatText}>
      <div className={`${styles.line} ${styles.lineWide} shine-loading`} style={{ width: "62%" }} />
      <div className={`${styles.line} ${styles.lineSmall} shine-loading`} style={{ width: "44%" }} />
      <div className={`${styles.line} shine-loading`} style={{ width: "34%" }} />
      <div className={`${styles.line} ${styles.lineSmall} ${styles.chatFooter} shine-loading`} style={{ width: "70%" }} />
    </div>
  </div>
);

const Person = () => (
  <div className={styles.personRow}>
    <S className={styles.personAvatar} />
    <div className={styles.personText}>
      <Lines widths={["58%", "40%"]} />
      <div className={styles.personStats}>
        <S className={styles.personStat} />
        <S className={styles.personStat} />
      </div>
    </div>
  </div>
);

const BODIES = { feed: Feed, activity: Activity, chat: Chat, person: Person };

export const SkeletonCard = ({ variant = "chat", fill = false }) => {
  const Body = BODIES[variant] || Chat;
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${
        fill ? `${styles.fill} tile-skeleton` : ""
      }`}
      style={shineSync()}
      aria-hidden={fill || undefined}
    >
      <Body />
    </div>
  );
};

const SkeletonCards = ({ count = 3, variant = "chat" }) => (
  <div className={styles.list} role="status" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} variant={variant} />
    ))}
  </div>
);

export default SkeletonCards;
