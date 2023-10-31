import SimpleButton from "../UI/SimpleButton";
import styles from "./styles/WarningPopup.module.scss";

const WarningPopup = (props) => {
  return (
    <div style={props.style} className={styles.container}>
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
  );
};

export default WarningPopup;
