import { Fragment } from "react";
import styles from "./styles/NavButton.module.scss";

const NavButton = (props) => {
  return (
    <div className={`${styles.container} ${props.className}`}>
      <button onClick={props.onClick} className={styles.button}>
        {props.icon ? (
          <Fragment>
            <img
              style={props.imgStyle}
              className={styles.iconButton}
              src={props.icon}
              alt="button_icon"
            />
            <div className={styles.iconText}>{props.text}</div>
          </Fragment>
        ) : (
          <div className={styles.textButton}>{props.text}</div>
        )}
      </button>
      {props.children}
    </div>
  );
};

export default NavButton;
