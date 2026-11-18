import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/PhotoPopup.module.scss";
import { createPortal } from "react-dom";
import { popupActions } from "../../store/popup-slice";
import { pixelsToRem } from "../../utils/utils";
import { useScrollLock } from "../../utils/scrollLock";
import { useT } from "../../i18n";

const PhotoPopup = (props) => {
  const { t } = useT();
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === "view-photo";
  const popupDisplay = showPopup ? "flex" : "none";
  const noGutters = pixelsToRem(window.innerWidth) < 40;
  // Shown instantly: no fade in or out
  const popupStyle = { display: popupDisplay };
  const popupImage = useSelector((state) => state.popup.popupImage);
  const containerStyle = {
    width: noGutters ? "100%" : null,
    height: noGutters ? "0" : null,
    paddingBottom: noGutters ? "100%" : null,
  };

  const dispatch = useDispatch();
  useScrollLock(showPopup);

  const handleClosePopup = () => {
    dispatch(popupActions.hidePopup());
  };

  return createPortal(
    <div style={popupStyle} className={styles.container} data-instant="true">
      <div onClick={handleClosePopup} className={styles.blackout}></div>
      <div style={containerStyle} className={styles.imageContainer}>
        {popupImage && (
          <img className={styles.image} src={popupImage} alt={t("popups.photo.alt")} />
        )}
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default PhotoPopup;
