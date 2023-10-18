import styles from "./styles/SimpleInput.module.scss";

const SimpleInput = (props) => {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={props.name}>{props.label}</label>
      <input className={styles.input} {...props}></input>
    </div>
  );
};

export default SimpleInput;
