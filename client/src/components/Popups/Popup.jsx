import { createPortal } from "react-dom";
import styles from "./styles/Popup.module.scss";

const Popup = (props) => {
  return createPortal(
    <div style={props.style} className={styles.container}>
      <div className={styles.blackout}></div>
      <div className={styles.popup}>{props.children}</div>
    </div>,
    document.getElementById("popup")
  );
};

export default Popup;
