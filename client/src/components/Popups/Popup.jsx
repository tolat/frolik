import { createPortal } from "react-dom";
import styles from "./styles/Popup.module.scss";
import { useEffect, useState } from "react";
import { pixelsToRem } from "../../utils/utils";

const Popup = (props) => {
  const [opacity, setOpacity] = useState(0);
  const showPopup = props.showPopup;
  const noGutters = pixelsToRem(window.innerWidth) < 40;
  const containerStyle = {
    width: noGutters ? "100vw" : null,
    margin: noGutters ? "0" : null,
  };
  const popupStyle = {
    width: noGutters ? "90%" : null,
    padding: noGutters ? "1rem" : null,
  };

  // Change opacity
  useEffect(() => {
    showPopup ? setOpacity(1) : setOpacity(0);
  }, [showPopup]);

  return createPortal(
    <div
      style={{ ...props.style, opacity: opacity, ...containerStyle }}
      className={styles.container}
    >
      <div className={styles.blackout}></div>
      <div style={popupStyle} className={styles.popup}>
        {props.children}
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default Popup;
