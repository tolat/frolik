import styles from "./styles/SlideInModal.module.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";
import backArrow from "../../images/left-arrow.png";
import { hideModal } from "../../store/modal-actions";

function pixelsToRem(pixels) {
  // Get the root font size from the computed style of the document element
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  return pixels / rootFontSize;
}

const SlideInModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const noGutters = pixelsToRem(window.innerWidth) < 40;
  const outerContainerWidth = noGutters ? "200%" : null;
  const outerContainerMarginLeft = noGutters ? "100%" : null;
  const containerWidth = noGutters ? "50%" : null;
  const headerWidth = noGutters ? "100vw" : null;
  const user = useSelector((state) => state.auth.user);

  const handleBackButtonClick = (e) => {
    hideModal();
  };

  return (
    <div
      style={{
        zIndex: modalState.zIndex,
        opacity: modalState.opacity,
        width: outerContainerWidth,
        marginLeft: outerContainerMarginLeft,
        height: !user ? "100%" : null,
      }}
      className={`${styles.outerContainer} noscroll`}
    >
      <div
        style={{
          marginLeft: `${modalState.marginLeft}`,
          width: containerWidth,
        }}
        className={styles.container}
        id="modal-container"
      >
        <div
          id="modal-header-container"
          className={styles.modalHeader}
          style={{ ...modalState.headerStyle, width: headerWidth }}
        >
          <div className={styles.leftContainer}>
            <div onClick={handleBackButtonClick} className={styles.backButton}>
              <img
                className={styles.arrowImage}
                src={backArrow}
                alt="back-arrow"
              ></img>
            </div>
            <div id="slide-in-modal-header"></div>
          </div>
          <div id="slide-in-modal-button"></div>
        </div>
      </div>
      <div className={styles.baffle} />
    </div>
  );
};

export default SlideInModal;
