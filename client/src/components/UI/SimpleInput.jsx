import { forwardRef, useEffect, useId, useState } from "react";
import styles from "./styles/SimpleInput.module.scss";

const SimpleInput = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const generatedId = useId();
  const inputID = props.id || generatedId;

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
      id={inputID}
      className={`${styles.container} ${props.className}`}
    >
      {!props.label ? null : (
        <label className={styles.label} htmlFor={props.name}>
          {props.label}
        </label>
      )}
      {/* Optional unit shown inside the field, e.g. "$" before or "hrs" after */}
      <div className={styles.field}>
        {props.prefix ? (
          <span className={`${styles.unit} ${styles.prefix}`} aria-hidden="true">
            {props.prefix}
          </span>
        ) : null}
        <input
          style={{
            ...(props.prefix ? { paddingInlineStart: "2.8rem" } : null),
            ...(props.suffix ? { paddingInlineEnd: `${1.8 + 0.75 * String(props.suffix).length}rem` } : null),
            ...props.inputStyle,
          }}
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
          min={props.min}
          max={props.max}
          step={props.step}
          maxLength={props.maxLength}
          inputMode={props.inputMode}
        ></input>
        {props.suffix ? (
          <span className={`${styles.unit} ${styles.suffix}`} aria-hidden="true">
            {props.suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export default SimpleInput;
