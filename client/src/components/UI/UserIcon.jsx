import styles from "./styles/UserIcon.module.scss";
import { memo } from "react";
import { useSelector } from "react-redux";
import CroppedImage from "./CroppedImage";

const getCategoryPercentage = (category, user) => {
  const numCategory = user.outings?.filter(
    (o) => o.activity?.category === category
  ).length;

  return (100 * (numCategory / user?.outings?.length)).toFixed(2);
};

const genBackgroundStr = (user, categoryColorMap) => {
  // Return grey border if user has no outings
  if (!user || !user.outings[0] || !categoryColorMap) {
    return "rgb(220,220,220)";
  }

  let backgroundString = "conic-gradient(";
  const keys = Object.keys(categoryColorMap);
  let percentageMap = {};

  // Build percentage map
  for (let i = 0; i < keys.length; i++) {
    const category = keys[i];
    const percentage = parseFloat(getCategoryPercentage(category, user));
    if (percentage !== 0) {
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
      /* `${categoryColorMap[category]} ${cumulativePercentage}% ${
        percentage + cumulativePercentage
      }%` */
      
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

const UserIcon = memo(function UserIcon(props) {
  const categoryColorMap = useSelector(
    (state) => state.auth.globals?.categoryColorMap
  );
  const backgroundString = genBackgroundStr(props.user, categoryColorMap);
  const photoDimension = `${props.sizeInRem - 2 * props.borderSizeInRem}rem`;
  const pieDimension = `${props.sizeInRem - props.borderSizeInRem}rem`;
  const backerDimension = `${props.sizeInRem}rem`;
  const dataState = useSelector((state) => state.data);
  const master = dataState.masterPhotoDimension;
  const userData = dataState.users[props.user?._id];
  const scalingFactor =
    (parseFloat(props.sizeInRem) - 2 * parseFloat(props.borderSizeInRem)) /
    master;
  let zoom = userData?.zoom;
  let crop = { ...userData?.crop };
  crop.x = crop.x * scalingFactor;
  crop.y = crop.y * scalingFactor;
  const photoString = userData?.profile_picture;

  const pieStyle = {
    width: pieDimension,
    height: pieDimension,
    background: backgroundString,
    boxShadow: props.pieShadow && "rgba(0, 0, 0, 0.24) 0px 3px 8px"
  };

  const backerStyle = {
    width: backerDimension,
    height: backerDimension,
  };

  return (
    <div className={styles.container}>
      <div
        style={{ ...backerStyle, ...props.style }}
        className={styles.whiteBacker}
      >
        {props.badge ? (
          <div className={styles.badgeContainer}>
            <div className={styles.badgeContent}>{props.badge}</div>
          </div>
        ) : null}
        {!photoString ? null : (
          <div style={pieStyle} className={styles.pieChart}>
            <CroppedImage
              image={photoString}
              zoom={zoom}
              crop={crop}
              style={{ height: photoDimension, width: photoDimension }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default UserIcon;
