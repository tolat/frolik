import StatIcon from "./StatIcon";
import styles from "./styles/ActivityCard.module.scss";
import timeIcon from "../../images/clock.png";
import costIcon from "../../images/bill.png";
import ratingIcon from "../../images/star.png"
import groupIcon from "../../images/friends.png";
import { categoryColorMap } from "../../utils/globals";
import SimpleButton from "./SimpleButton";

const ActivityCard = (props) => {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };

  return (
    <div style={props.style} className={styles.outerContainer}>
      <div
        style={{ backgroundColor: categoryColorMap[props.activity.category] }}
        className={styles.categoryStripe}
      ></div>
      <div className={styles.innerContainer}>
        <div className={styles.upperContainer}>
          <div className={styles.name}>
            {props.activity.name}{" "}
            <SimpleButton className={styles.select}>Select</SimpleButton>
          </div>
          <div className={styles.description}>{props.activity.description}</div>
          <div className={styles.specsContainer}>
            <StatIcon
              alt="time"
              icon={timeIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`${props.activity.duration} hrs`}
            />
            <StatIcon
              alt="cost"
              icon={costIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`$${props.activity.cost}`}
            />
            <StatIcon
              alt="group"
              icon={groupIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`${props.activity.participants} +`}
            />
            <StatIcon
              alt="rating"
              icon={ratingIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`${props.activity.participants}/5`}
            />
          </div>
        </div>
        <SimpleButton>Instructions</SimpleButton>
      </div>
    </div>
  );
};

export default ActivityCard;
