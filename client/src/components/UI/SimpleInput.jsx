import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/SimpleInput.module.scss";

const SimpleInput = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const inputID = props.id || Math.random();

  // Execute on changes to the input element
  const onChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.setDataChanged && props.setDataChanged(newValue);
  };

  const onBlur = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.onBlur && props.onBlur(newValue);
  };

  // Set default value on component load and
  // run submit validators if submitting
  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div
      style={props.style}
      className={`${styles.container} ${props.className}`}
    >
      {!props.label ? null : (
        <label className={styles.label} htmlFor={props.name}>
          {props.label}
        </label>
      )}
      <input
        style={props.inputStyle}
        onBlur={onBlur}
        placeholder={props.placeholder}
        onChange={onChange}
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
