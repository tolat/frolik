import styles from "./styles/SlideInModal.module.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";

import backArrow from "../../images/left-arrow.png";
import { hideModal } from "../../store/modal-actions";

const SlideInModal = (props) => {
  const modalState = useSelector((state) => state.modal);

  const handleBackButtonClick = (e) => {
    hideModal();
  };

  return (
    <div
      style={{ zIndex: modalState.zIndex, opacity: modalState.opacity }}
      className={`${styles.outerContainer} noscroll`}
    >
      <div
        style={{ marginLeft: `${modalState.marginLeft}` }}
        className={styles.container}
        id="modal-container"
      >
        <div onClick={handleBackButtonClick} className={styles.backButton}>
          <img
            className={styles.arrowImage}
            src={backArrow}
            alt="back-arrow"
          ></img>
        </div>
      </div>
      <div className={styles.baffle} />
    </div>
  );
};

export default SlideInModal;
