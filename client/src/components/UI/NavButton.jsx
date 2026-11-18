import { Fragment } from "react";
import styles from "./styles/NavButton.module.scss";

const NavButton = (props) => {
  return (
    <div className={`${styles.container} ${props.className}`}>
      <button onClick={props.onClick} className={styles.button}>
        {props.featured && props.icon ? (
          // Centre button: the icon in a white disc inside a colour ring
          <Fragment>
            <span
              className={`${styles.ring} ${props.blue ? styles.ringActive : ""}`}
              style={props.ringBackground ? { "--ring": props.ringBackground } : null}
            >
              <span className={styles.disc}>
                <img className={styles.featuredIcon} src={props.icon} alt="" />
              </span>
            </span>
            <div
              className={`${styles.iconText} ${
                props.blue ? styles.blue : null
              }`}
            >
              {props.text}
            </div>
          </Fragment>
        ) : props.icon ? (
          <Fragment>
            <img
              style={props.imgStyle}
              className={styles.iconButton}
              src={props.icon}
              alt=""
            />
            <div
              className={`${styles.iconText} ${
                props.blue ? styles.blue : null
              }`}
            >
              {props.text}
            </div>
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
