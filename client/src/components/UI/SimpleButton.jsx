import styles from "./styles/SimpleButton.module.scss";

const SimpleButton = (props) => {
  return (
    <button
      {...props}
      className={`${styles.container} ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default SimpleButton;
