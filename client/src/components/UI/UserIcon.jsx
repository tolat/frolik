import styles from "./styles/UserIcon.module.scss";

// TEMPORARY - PULL THIS FROM THE DB EVENTUALLY
import { categoryColorMap, profilePics } from "../../utils/globals";
// TEMPORARY - PULL THIS FROM THE DB EVENTUALLY

const getCategoryPercentage = (category, user) => {
  const numCategory = user.outings.filter(
    (o) => o.activity.category === category
  ).length;

  return (100 * (numCategory / user.outings.length)).toFixed(2);
};

const genBackgroundStr = (user) => {
  let backgroundString = "conic-gradient(";
  const keys = Object.keys(categoryColorMap);
  let percentageMap = {};

  // Build percentage map
  for (let i = 0; i < keys.length; i++) {
    const category = keys[i];
    const percentage = parseFloat(getCategoryPercentage(category, user));
    if (percentage != 0) {
      percentageMap[category] = percentage;
    }
  }

  // Build color map for the icon circle based on percentage
  // of each activity category vs total number of that category for user
  const mapKeys = Object.keys(percentageMap);
  let cumulativePercentage = 0;
  for (let i = 0; i < mapKeys.length; i++) {
    const category = mapKeys[i];
    const nextCategory = mapKeys[(i + 1) % mapKeys.length];
    const percentage = percentageMap[category];

    backgroundString = backgroundString.concat(
      `${categoryColorMap[category]} ${cumulativePercentage}%, 
         ${categoryColorMap[nextCategory]} ${
        cumulativePercentage + percentage
      }%`
    );

    if (i < mapKeys.length - 1) {
      backgroundString = backgroundString.concat(",");
    }

    cumulativePercentage = cumulativePercentage + percentage;
  }

  backgroundString = backgroundString.concat(")");
  return backgroundString;
};

const UserIcon = (props) => {
  const backgroundString = genBackgroundStr(props.user);
  const photoDimension = `${props.sizeInRem - 2 * props.borderSizeInRem}rem`;
  const pieDimension = `${props.sizeInRem - props.borderSizeInRem}rem`;
  const backerDimension = `${props.sizeInRem}rem`;

  // TEMPORARY - PULL THIS FROM THE DB EVENTUALLY
  const profilePic = profilePics[props.user.first_name.toLowerCase()];
  // TEMPORARY - PULL THIS FROM THE DB EVENTUALLY

  const pieStyle = {
    width: pieDimension,
    height: pieDimension,
    background: backgroundString,
  };

  const backerStyle = {
    backgroundColor: props.backer ? "white" : "transparent",
    width: backerDimension,
    height: backerDimension,
  };

  return (
    <div
      style={{ ...backerStyle, ...props.style }}
      className={`${styles.whiteBacker} ${props.className}`}
    >
      <div style={pieStyle} className={styles.pieChart}>
        <img
          src={profilePic}
          className={styles.photo}
          style={{ height: photoDimension, width: photoDimension }}
          alt="profile_picture"
        />
      </div>
    </div>
  );
};

export default UserIcon;
