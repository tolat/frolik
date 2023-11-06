import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import Popup from "./Popup";
import styles from "./styles/WarningPopup.module.scss";

const WarningPopup = (props) => {
  const popupState = useSelector((state) => state.popup);
  const popupDisplay = popupState.selector === props.selector ? "flex" : "none";

  return (
    <Popup>
      <div
        onLoad={props.onLoad}
        id={props.id}
        className={styles.container}
        style={{ ...props.style, display: popupDisplay }}
      >
        <div className={styles.header}>{props.header}</div>
        <div className={styles.message}>{props.message}</div>
        <div className={styles.buttonContainer}>
          {props.ok ? (
            <SimpleButton onClick={props.okClick} className={styles.okButton}>
              {props.ok}
            </SimpleButton>
          ) : null}
          {props.ok && props.cancel ? (
            <div className={styles.buttonSpacer} />
          ) : null}
          {props.cancel ? (
            <SimpleButton
              onClick={props.cancelClick}
              className={styles.cancelButton}
            >
              {props.cancel}
            </SimpleButton>
          ) : null}
        </div>
      </div>
    </Popup>
  );
};

export default WarningPopup;
