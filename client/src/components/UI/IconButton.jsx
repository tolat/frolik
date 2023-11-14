import styles from "./styles/IconButton.module.scss";

const IconButton = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={`${styles.container} ${props.className}`}
    >
      <img
        style={props.iconStyle}
        src={props.icon}
        className={styles.icon}
        alt={`${props.alt}_button`}
      />
    </div>
  );
};

export default IconButton;
