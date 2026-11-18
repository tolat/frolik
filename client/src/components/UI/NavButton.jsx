import { Fragment } from "react";
import styles from "./styles/NavButton.module.scss";
import TintedIcon from "./TintedIcon";

// The active tab's icon is painted in the primary colour
const Icon = ({ src, className, active, style }) =>
  active ? (
    <TintedIcon src={src} className={className} style={style} />
  ) : (
    <img style={style} className={className} src={src} alt="" />
  );

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
                <Icon className={styles.featuredIcon} src={props.icon} active={props.blue} />
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
            <Icon
              style={props.imgStyle}
              className={styles.iconButton}
              src={props.icon}
              active={props.blue}
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
