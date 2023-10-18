import { forwardRef } from "react";
import styles from "./styles/SimpleInput.module.scss";

const SimpleInput = forwardRef((props, ref) => {

  
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={props.name}>
        {props.label}
      </label>
      <input ref={ref || null} className={styles.input} {...props}></input>
    </div>
  );
});

export default SimpleInput;
