import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import Popup from "./Popup";
import styles from "./styles/WarningPopup.module.scss";

const WarningPopup = (props) => {
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === props.selector;
  const popupDisplay = showPopup ? "flex" : "none";

  return (
    <Popup style={{ display: popupDisplay }} showPopup={showPopup}>
      <div onLoad={props.onLoad} id={props.id} className={styles.container}>
        <div className={styles.header}>{props.header}</div>
        <div className={styles.message}>{props.message}</div>
        <div className={styles.buttonContainer}>
          {props.ok ? (
            <SimpleButton
              noShadow={true}
              onClick={props.okUnclickable? null : props.okClick}
              className={`${styles.okButton} ${
                props.okUnclickable ? styles.unclickableButton : null
              }`}
            >
              {props.ok}
            </SimpleButton>
          ) : null}
          {props.ok && (props.cancel || props.delete) ? (
            <div className={styles.buttonSpacer} />
          ) : null}
          {props.cancel ? (
            <SimpleButton
              noShadow={true}
              onClick={props.cancelClick}
              className={styles.cancelButton}
            >
              {props.cancel}
            </SimpleButton>
          ) : null}
          {(props.ok || props.cancel) && props.delete ? (
            <div className={styles.buttonSpacer} />
          ) : null}
          {props.delete ? (
            <SimpleButton
              noShadow={true}
              onClick={props.deleteClick}
              className={styles.deleteButton}
            >
              {props.delete}
            </SimpleButton>
          ) : null}
        </div>
      </div>
    </Popup>
  );
};

export default WarningPopup;
