import styles from "./styles/IconBadge.module.scss";

const IconBadge = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={`${styles.container} ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default IconBadge;
