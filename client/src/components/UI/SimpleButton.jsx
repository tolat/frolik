import styles from "./styles/SimpleButton.module.scss";

const SimpleButton = (props) => {
  return (
    <div
      {...props}
      className={styles.container}
    >
      {props.children}
    </div>
  );
};

export default SimpleButton;
