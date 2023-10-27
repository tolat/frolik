import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/SimpleInput.module.scss";

const SimpleInput = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);

  const handleSetDataChanged = (value) => {
    if (value !== props.defaultVal) {
      props.setDataChanged && props.setDataChanged(true);
    } else {
      props.setDataChanged && props.setDataChanged(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    handleSetDataChanged(newValue);
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
        required={props.required}
        type={props.type}
      ></input>
    </div>
  );
});

export default SimpleInput;
