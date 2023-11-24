import styles from "./styles/UserIcon.module.scss";
import { memo } from "react";
import { useSelector } from "react-redux";
import CroppedImage from "./CroppedImage";
import { genBackgroundStr } from "../../utils/utils";

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
  crop.x *= scalingFactor;
  crop.y *= scalingFactor;
  const photoString = userData?.profile_picture;
  const iconID = `usericon-${Math.random()}`;

  const pieStyle = {
    width: pieDimension,
    height: pieDimension,
    background: backgroundString,
    boxShadow: props.pieShadow && "rgba(0, 0, 0, 0.24) 0px 3px 8px",
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
        {props.badge && photoString && photoString !== "queued" ? (
          <div className={styles.badgeContainer} style={props.badgeStyle}>
            <div
              className={styles.badgeContent}
              style={props.badgeContentStyle}
            >
              {props.badge}
            </div>
          </div>
        ) : null}
        {!photoString || photoString === "queued" ? (
          true ? null : (
            <div
              style={{ height: photoDimension, width: photoDimension }}
              className={styles.placeholderImage}
            ></div>
          )
        ) : (
          <div
            id={iconID}
            style={pieStyle}
            className={`${styles.pieChart} hidden`}
          >
            <CroppedImage
              onLoad={() =>
                document.getElementById(iconID).classList.remove("hidden")
              }
              image={photoString}
              zoom={zoom}
              crop={crop}
              showPhotoOnClick={props.showPhotoOnClick}
              style={{
                height: photoDimension,
                width: photoDimension,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default UserIcon;
