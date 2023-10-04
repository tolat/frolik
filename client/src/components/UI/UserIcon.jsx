import styles from "./styles/UserIcon.module.scss";
import { categoryColorMap } from "../../utils/client-dev-db";

const getCategoryPercentage = (category, user) => {
  const numCategory = user.outings.filter(
    (o) => o.activity.category === category
  ).length;

  return (100 * (numCategory / user.outings.length)).toFixed(2);
};

const genBackgroundStr = (user) => {
  let backgroundString = "conic-gradient(";
  const keys = Object.keys(categoryColorMap);
  let prevPercentage = 0;

  // Build color map for the icon circle based on percentage
  // of each activity category vs tota number of that category for user
  for (let i = 0; i < keys.length; i++) {
    const category = keys[i];
    const percentage = getCategoryPercentage(category, user);
    const cumulativePercentage =
      parseFloat(prevPercentage) + parseFloat(percentage);
    backgroundString = backgroundString.concat(
      `${categoryColorMap[category]} ${parseFloat(
        prevPercentage
      )}% ${cumulativePercentage}%`
    );
    if (i < keys.length - 1) {
      backgroundString = backgroundString.concat(",");
    }
    prevPercentage = cumulativePercentage;
  }

  backgroundString = backgroundString.concat(")");

  return backgroundString;
};

const UserIcon = (props) => {
  const backgroundString = genBackgroundStr(props.user);
  const photoDimension = `${props.sizeInRem - 2}rem`;
  const pieDimension = `${props.sizeInRem}rem`;

  const pieStyle = {
    width: pieDimension,
    height: pieDimension,
    background: backgroundString,
  };


  return (
    <div style={pieStyle} className={styles.pieChart}>
      <img
        src={props.user.profile_picture}
        className={styles.photo}
        style={{  height: photoDimension, width: photoDimension }}
        alt='profile_picture'
      />
    </div>
  );
};

export default UserIcon;
