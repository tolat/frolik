import styles from "./styles/StatIcon.module.scss";

const StatIcon = (props) => {
  return (
    <div
      onClick={props.onClick}
      style={props.style}
      className={styles.container}
    >
      <img
        style={props.iconStyle}
        src={props.icon}
        className={styles.icon}
        alt={`${props.alt}_icon`}
      />
      <div className={styles.rating}>{props.rating}</div>
    </div>
  );
};

export default StatIcon;
