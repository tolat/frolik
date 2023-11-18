import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/PhotoPopup.module.scss";
import { createPortal } from "react-dom";
import { popupActions } from "../../store/popup-slice";
import { useEffect } from "react";
import { useState } from "react";
import { pixelsToRem } from "../../utils/utils";

const PhotoPopup = (props) => {
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === props.selector;
  const popupDisplay = showPopup ? "flex" : "none";
  const [opacity, setOpacity] = useState(0);
  const noGutters = pixelsToRem(window.innerWidth) / 0.65 < 40;
  const popupStyle = { display: popupDisplay, opacity: opacity };
  const containerStyle = {
    width: noGutters ? "100%" : null,
    height: noGutters ? "0" : null,
    paddingBottom: noGutters ? "100%" : null,
  };

  const imageString = props.image
    ? `data:image/png;base64,${props.image}`
    : null;

  const dispatch = useDispatch();

  // Change opacity
  useEffect(() => {
    showPopup ? setOpacity(1) : setOpacity(0);
  }, [showPopup]);

  const handleClosePopup = () => {
    dispatch(popupActions.hidePopup());
  };

  return createPortal(
    <div style={popupStyle} id={props.id} className={styles.container}>
      <div onClick={handleClosePopup} className={styles.blackout}></div>
      <div style={containerStyle} className={styles.imageContainer}>
        <img className={styles.image} src={imageString} alt="viewing" />
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default PhotoPopup;
