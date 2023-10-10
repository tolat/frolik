import styles from "./styles/SlideInModal.module.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";

import backArrow from "../../images/left-arrow.png";
import { useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "./EditProfileModal";

const SlideInModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const handleBackButtonClick = (e) => {
    dispatch(modalActions.toggleModal());
    setTimeout(() => {
      dispatch(modalActions.setZIndex("-1"));
    }, 300);
  };

  // Map to set modal to display based on the modal state
  const modalMap = {
    "edit-profile": <EditProfileModal />,
    none: null,
  };

  return (
    <div
      style={{ zIndex: modalState.zIndex }}
      className={styles.outerContainer}
    >
      <div
        style={{ marginLeft: `${modalState.marginLeft}` }}
        className={styles.container}
      >
        <div onClick={handleBackButtonClick} className={styles.backButton}>
          <img
            className={styles.arrowImage}
            src={backArrow}
            alt="back-arrow"
          ></img>
        </div>
        {modalMap[modalState.selector]}
      </div>
      <div className={styles.baffle} />
    </div>
  );
};

export default SlideInModal;
