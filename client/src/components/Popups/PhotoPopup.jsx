import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/PhotoPopup.module.scss";
import { createPortal } from "react-dom";
import { popupActions } from "../../store/popup-slice";
import { useScrollLock } from "../../utils/scrollLock";
import { useT } from "../../i18n";
import { isVideoUrl } from "../../utils/media";

const PhotoPopup = (props) => {
  const { t } = useT();
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === "view-photo";
  const popupDisplay = showPopup ? "flex" : "none";
  // Shown instantly: no fade in or out
  const popupStyle = { display: popupDisplay };
  const popupImage = useSelector((state) => state.popup.popupImage);

  const dispatch = useDispatch();
  useScrollLock(showPopup);

  const handleClosePopup = () => {
    dispatch(popupActions.hidePopup());
  };

  return createPortal(
    <div style={popupStyle} className={styles.container} data-instant="true">
      <div onClick={handleClosePopup} className={styles.blackout}></div>
      {/* The photo at its own shape, as large as fits, centred both ways */}
      {/* Videos play with sound and controls; tapping outside closes */}
      {popupImage && isVideoUrl(popupImage) && showPopup ? (
        <>
        <button
          type="button"
          className={styles.close}
          onClick={handleClosePopup}
          aria-label={t("popups.photo.close")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <video
          key={popupImage}
          className={styles.image}
          src={popupImage}
          controls
          autoPlay
          loop
          playsInline
        />
        </>
      ) : popupImage && !isVideoUrl(popupImage) && (
        <img
          className={styles.image}
          src={popupImage}
          alt={t("popups.photo.alt")}
          onClick={handleClosePopup}
        />
      )}
    </div>,
    document.getElementById("popup")
  );
};

export default PhotoPopup;
