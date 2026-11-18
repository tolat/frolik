import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import Popup from "./Popup";
import styles from "./styles/WarningPopup.module.scss";

const WarningPopup = (props) => {
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === props.selector;

  return (
    <Popup showPopup={showPopup} label={typeof props.header === "string" ? props.header : undefined}>
      <div onLoad={props.onLoad} id={props.id} className={styles.container}>
        <div className={styles.header}>{props.header}</div>
        <div className={styles.message}>{props.message}</div>
        {/* Drawer layout: full-width buttons stacked, the main action on
            top and Cancel last (closest to the thumb's resting spot) */}
        <div className={styles.buttonContainer}>
          {props.ok ? (
            <SimpleButton
              noShadow={true}
              onClick={props.okUnclickable ? null : props.okClick}
              className={`${styles.okButton} ${
                props.okUnclickable ? styles.unclickableButton : ""
              }`}
            >
              {props.ok}
            </SimpleButton>
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
          {props.cancel ? (
            <SimpleButton
              noShadow={true}
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
