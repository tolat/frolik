import { forwardRef, useState } from "react";
import styles from "./styles/SimpleSelect.module.scss";

const SimpleSelect = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const handleChange = (e) => {
    setValue(e.target.value);
    props.setDataChanged && props.setDataChanged(e.target.value);
  };

  return (
    <div id={props.id} className={`${styles.container} ${props.className}`}>
      <label className={styles.label} htmlFor={`${props.name}-select`}>
        {props.label}
      </label>
      <select
        required={props.required}
        className={`${styles.select} ${props.inputClassName}`}
        name={props.name}
        id={`${props.name}-select`}
        ref={ref}
        value={value}
        onChange={handleChange}
      >
        {props.options.map((o) => (
          <option key={Math.random()} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SimpleSelect;
