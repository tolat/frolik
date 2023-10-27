import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/CustomSelect.module.scss";

const CustomAutocomplete = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const [options, setOptions] = useState(props.value)

  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div classname={styles.container}>
      <input className={styles.input}></input>

    </div>
  );
});

export default CustomAutocomplete;
