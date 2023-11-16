import { createPortal } from "react-dom";
import styles from "./styles/Popup.module.scss";
import { useEffect, useState } from "react";

const Popup = (props) => {
  const [opacity, setOpacity] = useState(0);
  const showPopup = props.showPopup;

  // Change opacity
  useEffect(() => {
    showPopup ? setOpacity(1) : setOpacity(0);
  }, [showPopup]);

  return createPortal(
    <div
      style={{ ...props.style, opacity: opacity }}
      className={styles.container}
    >
      <div className={styles.blackout}></div>
      <div className={styles.popup}>
        {props.children}
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default Popup;
