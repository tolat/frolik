import { useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/OutingModal.module.scss";
import SimpleButton from "../UI/SimpleButton";
import { useEffect } from "react";
import Popup, { hidePopup, showPopup } from "../Popups/Popup";
import WarningPopup from "../Popups/WarningPopup";
import outingsBarIcon from "../../images/outingsToolbar.png";

const OutingModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "outing" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const showInfoPupup = props.showInfoPopup;

  // Show popup if this props required it
  useEffect(() => {
    if (showInfoPupup && modalDisplay === "flex") {
      showPopup();
    }
  }, [showInfoPupup, modalDisplay]);

  const newOutingMessage = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      A request to accept the Outing has been sent to the other users.
      <br /> Once they accept the Outing, they will appear in the Outing chat.
      <br /> You can view this outing any time on the Profile page under the
      following tab:
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={"outings-icon"}
      />
    </div>
  );

  const onPopupOk = () => {
    hidePopup();
  };

  return !props.outing ? null : (
    <ModalPortal>
      <Popup>
        <WarningPopup
          header={"You've created an Outing!"}
          message={newOutingMessage}
          ok={"OK"}
          okClick={onPopupOk}
        />
      </Popup>
      <div style={modalStyle} className={styles.container}>
        <div className={styles.outingName}></div>
        <div className={styles.outingStatus}></div>
        <SimpleButton className={styles.chatButton}>
          Go to Outing Chat
        </SimpleButton>
        <div className={styles.sideBySide}>
          <SimpleButton>Mark Completed</SimpleButton>
          <div className={styles.buttonSpacer}></div>
          <SimpleButton></SimpleButton>
        </div>
      </div>
    </ModalPortal>
  );
};

export default OutingModal;
