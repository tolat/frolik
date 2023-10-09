import styles from "./styles/NavButton.module.scss";

const NavButton = (props) => {
  return (
    <div className={`${styles.container} ${props.className}`}>
      <button onClick={props.onClick} className={styles.button}>
        {props.icon ? (
          <img
            className={styles.iconButton}
            src={props.icon}
            alt="button_icon"
          />
        ) : (
          <div className={styles.textButton}>
            {props.text}
          </div>
        )}
      </button>
    </div>
  );
};

export default NavButton;
