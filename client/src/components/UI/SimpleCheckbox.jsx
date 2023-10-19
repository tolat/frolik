import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/SimpleCheckbox.module.scss";

const SimpleCheckbox = forwardRef((props, ref) => {
  const [checked, setChecked] = useState(props.defaultVal);

  const handleChange = (e) => {
    setChecked((prevState) => {
      return !prevState;
    });
  };

  useEffect(() => {
    setChecked(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div className={styles.container}>
      <input
        id={props.id}
        name={props.name}
        onClick={props.onClick}
        type={"checkbox"}
        ref={ref}
        className={styles.input}
        checked={checked}
        onChange={handleChange}
      />
      <label className={styles.label} htmlFor={props.name}>
        {props.label}
      </label>
    </div>
  );
});

export default SimpleCheckbox;
