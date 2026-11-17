import Cropper from "react-easy-crop";
import styles from "./styles/CroppedImage.module.scss";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import { Fragment, useState } from "react";

const CroppedImage = (props) => {
  const dispatch = useDispatch();
  // Pressed state via pointer events: iOS Safari doesn't reliably apply :active
  const [badgePressed, setBadgePressed] = useState(false);
  const badgeClickable = !!props.onBadgeClick;
  const onBadgeClick = (e) => {
    e.currentTarget.animate?.(
      [{ transform: "scale(0.86)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
      { duration: 260, easing: "ease-out" }
    );
    props.onBadgeClick?.(e);
  };

  const onImageClick = (e) => {
    if (props.showPhotoOnClick) {
      e.preventDefault();
      dispatch(popupActions.setPopupImage(props.image));
      dispatch(popupActions.showPopup("view-photo"));
    }
  };
  return (
    <div
      onClick={onImageClick}
      style={props.style}
      className={`${styles.container} ${props.className}`}
      id={props.id}
    >
      {!props.image || props.image === "queued" ? null : (
        <Fragment>
          <Cropper
            onMediaLoaded={props.onLoad}
            image={props.image}
            crop={props.crop}
            zoom={props.zoom}
            rotation={0}
            aspect={3 / 3}
            cropShape={"round"}
            onCropChange={() => {}}
            onZoomChange={() => {}}
            objectFit={"cover"}
            showGrid={false}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                borderRadius: "100rem",
              },
            }}
          />
          <div
            onClick={badgeClickable ? onBadgeClick : undefined}
            onPointerDown={badgeClickable ? () => setBadgePressed(true) : undefined}
            onPointerUp={badgeClickable ? () => setBadgePressed(false) : undefined}
            onPointerLeave={badgeClickable ? () => setBadgePressed(false) : undefined}
            onPointerCancel={badgeClickable ? () => setBadgePressed(false) : undefined}
            role={badgeClickable ? "button" : undefined}
            aria-label={badgeClickable ? "Change photo" : undefined}
            className={`${styles.badgeContainer} ${
              badgeClickable ? styles.badgeClickable : ""
            } ${badgePressed ? styles.badgePressed : ""}`}
            style={props.badgeStyle}
          >
            <div
              className={styles.badgeContent}
              style={props.badgeContentStyle}
            >
              {props.badge}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default CroppedImage;
