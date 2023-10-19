import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/SimpleInput.module.scss";

const SimpleInput = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);
  
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={props.name}>
        {props.label}
      </label>
      <input
        onChange={handleChange}
        value={value}
        ref={ref || null}
        className={styles.input}
        onClick={props.onClick}
        id={props.id}
        name={props.name}
      ></input>
    </div>
  );
});

export default SimpleInput;
