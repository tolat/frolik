import styles from "./styles/UserIcon.module.scss";
import { memo, useId, useState } from "react";
import { useSelector } from "react-redux";
import CroppedImage from "./CroppedImage";
import { genBackgroundStr } from "../../utils/utils";
import { shineSync } from "../../utils/shine";

const UserIcon = memo(function UserIcon(props) {
  const categoryColorMap = useSelector(
    (state) => state.auth.globals?.categoryColorMap
  );
  const backgroundString = genBackgroundStr(props.user, categoryColorMap);
  const photoDimension = `${props.sizeInRem - 2 * props.borderSizeInRem}rem`;
  const pieDimension = `${props.sizeInRem - props.borderSizeInRem}rem`;
  const backerDimension = `${props.sizeInRem}rem`;
  // Select only the specific user's data to avoid re-renders from unrelated photo loads
  const master = useSelector((state) => state.data.masterPhotoDimension);
  const userData = useSelector((state) => state.data.users[props.user?._id]);
  const scalingFactor =
    (parseFloat(props.sizeInRem) - 2 * parseFloat(props.borderSizeInRem)) /
    master;
  let zoom = userData?.zoom;
  let crop = { ...userData?.crop };
  crop.x *= scalingFactor;
  crop.y *= scalingFactor;
  const photoString = userData?.profile_picture;
  // useId() gives a stable ID across renders, preventing stale-closure bugs
  // where the onLoad callback looked up an ID that no longer matched the div
  const iconID = useId();
  // Round shimmer until the photo has actually painted (reset if it changes)
  const [loadedPhoto, setLoadedPhoto] = useState(null);
  const photoReady =
    photoString && photoString !== "queued" && loadedPhoto === photoString;

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
        {/* Loading: their colour ring, greyed out, round a shining disc
            where the photo goes (it used to be one plain grey circle) */}
        {photoReady ? null : (
          <div
            className={styles.skeletonRing}
            style={{ width: pieDimension, height: pieDimension }}
          >
            {/* The ring's own layer, so its grey filter doesn't darken the
                shine disc (which must match the other skeletons) */}
            <div className={styles.skeletonRingFill} style={{ background: backgroundString }} />
            <div
              className={`${styles.shimmer} shine-loading`}
              style={{ width: photoDimension, height: photoDimension, ...shineSync() }}
            />
          </div>
        )}
        {!photoString || photoString === "queued" ? null : (
          <div
            id={iconID}
            style={pieStyle}
            className={`${styles.pieChart} ${photoReady ? "" : styles.pending}`}
          >
            <CroppedImage
              onLoad={() => setLoadedPhoto(photoString)}
              image={photoString}
              zoom={zoom}
              crop={crop}
              iconID={iconID}
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
