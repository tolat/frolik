import { forwardRef, useState } from "react";
import styles from "./styles/SimpleSelect.module.scss";

const SimpleSelect = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultValue)
  const handleChange = (e)=>{
    setValue(e.target.value)
  }
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={`${props.name}-select`}>
        {props.label}
      </label>
      <select
        className={styles.select}
        name={props.name}
        id={`${props.name}-select`}
        ref={ref}
        value={value}
        onChange={handleChange}
      >
        {props.options.map((o) => (
          <option
            key={Math.random()}
            value={o}
          >
            {o}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SimpleSelect;
