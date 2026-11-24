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
        {props.glyph ? (
          // A line icon (lucide-react): darker and a touch bolder when active
          <Fragment>
            <props.glyph
              className={styles.glyph}
              size={23}
              strokeWidth={props.blue ? 2.3 : 1.9}
              aria-hidden="true"
            />
            <div className={`${styles.iconText} ${props.blue ? styles.blue : ""}`}>
              {props.text}
            </div>
          </Fragment>
        ) : props.icon ? (
          <Fragment>
            <Icon
              style={props.imgStyle}
              className={`${styles.iconButton} ${
                props.keepColor ? styles.logoIcon : ""
              }`}
              src={props.icon}
              active={props.blue && !props.keepColor}
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
