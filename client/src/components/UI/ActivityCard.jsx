import StatIcon from "./StatIcon";
import styles from "./styles/ActivityCard.module.scss";

import timeIcon from "../../images/clock.png";
import costIcon from "../../images/dollar.png";
import groupIcon from "../../images/friends.png";

const ActivityCard = (props) => {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };

  return (
    <div style={props.style} className={styles.outerContainer}>
      <div className={styles.categoryStripe}></div>
      <div className={styles.innerContainer}>
        <div className={styles.name}></div>
        <div className={styles.description}></div>
        <div className={styles.specsContainer}>
          <StatIcon
            alt="time"
            icon={timeIcon}
            style={statContainerStyle}
            iconStyle={statIconStyle}
            rating={"3"}
          />
          <div className={styles.specsIconContainer}>
            <div className={`${styles.specsIcon} cost-icon`}></div>
            <div className={styles.specsRating}></div>
          </div>
          <div className={styles.specsIconContainer}>
            <div className={`${styles.specsIcon} duration-icon`}></div>
            <div className={styles.specsRating}></div>
          </div>
          <div className={styles.specsIconContainer}>
            <div className={`${styles.specsIcon} duration-icon`}></div>
            <div className={styles.specsRating}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
